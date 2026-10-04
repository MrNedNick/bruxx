import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ReservationDialog from '../components/ReservationDialog.vue'
import SubscribeForm from '../components/SubscribeForm.vue'
import MenuSource from '../components/MenuSource.vue'
import { closeReservation, openReservation } from '../lib/reservation'
import { createMenuState } from '../lib/live-menu'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
})
afterEach(() => { closeReservation(); vi.useRealTimers() })

describe('booking', () => {
  it('opens when the reservation hash was handled before the dialog mounted', async () => {
    openReservation()
    const wrapper = mount(ReservationDialog)
    await flushPromises()
    expect(wrapper.element.open).toBe(true)
    expect(wrapper.get('iframe').attributes('src')).toContain('bookiopro.com/bruxx/')
    expect(wrapper.get('.booking-external').attributes('target')).toBe('_blank')
    await wrapper.get('button').trigger('click')
    await flushPromises()
    expect(wrapper.element.open).toBe(false)
    wrapper.unmount()
  })
})

describe('newsletter', () => {
  it('requires deliberate consent and never claims success after a timeout', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SubscribeForm, {
      props: { subscribe: { action: 'https://example.test/subscribe', fields: {} } },
      global: { stubs: { RouterLink: true } },
    })
    expect(wrapper.get('[type="checkbox"]').element.checked).toBe(false)
    await wrapper.get('[type="email"]').setValue('visitor@example.test')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('[type="submit"]').element.disabled).toBe(true)
    await vi.advanceTimersByTimeAsync(15000)
    expect(wrapper.get('[role="status"]').text()).toContain('nepodařilo potvrdit')
    expect(wrapper.get('[type="email"]').element.value).toBe('visitor@example.test')
    expect(wrapper.get('[type="submit"]').element.disabled).toBe(false)
    wrapper.unmount()
  })
})

describe('visible menu freshness', () => {
  it('does not label lunch live merely because the beer list loaded', async () => {
    const menu = createMenuState(() => Promise.resolve({ syncedAt: '2026-10-04T10:00:00Z' }), {
      beer: () => Promise.resolve({ beer: [] }), daily: () => Promise.reject(new Error('offline')),
    })
    await menu.ready
    const wrapper = mount(MenuSource, { props: { menu, part: 'daily' } })
    expect(wrapper.text()).toContain('4. října 2026')
    expect(wrapper.text()).toContain('nepodařilo načíst')
    expect(wrapper.find('.live').exists()).toBe(false)
    await wrapper.setProps({ part: 'beer' })
    expect(wrapper.text()).toContain('Aktuální nabídka')
    expect(wrapper.find('.fallback').exists()).toBe(false)
    wrapper.unmount()
  })
})
