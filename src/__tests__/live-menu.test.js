import { describe, expect, it } from 'vitest'
import { createMenuState, menuLang } from '../lib/live-menu'

const snapshot = { syncedAt: '2026-10-04T10:00:00Z', food: ['saved food'], beer: ['saved beer'], daily: { day: 'Monday' } }
const fail = () => Promise.reject(new Error('Service unavailable'))

describe('menu source integrity', () => {
  it('keeps a failed section cached when another export loads live', async () => {
    const state = createMenuState(() => Promise.resolve(snapshot), {
      dishes: fail,
      beer: () => Promise.resolve({ beer: ['fresh beer'] }),
      daily: fail,
    })
    await state.ready
    expect(state.data.value.food).toEqual(['saved food'])
    expect(state.data.value.beer).toEqual(['fresh beer'])
    expect(state.parts.value).toEqual({ dishes: 'snapshot', beer: 'live', daily: 'snapshot' })
    expect(state.updatedAt.value).toBe(snapshot.syncedAt)
    expect(state.loading.value).toBe(false)
  })

  it('does not let a slow snapshot overwrite fresh data', async () => {
    let finishSnapshot
    const state = createMenuState(() => new Promise(resolve => { finishSnapshot = resolve }), {
      beer: () => Promise.resolve({ beer: ['fresh beer'] }),
    })
    await Promise.resolve()
    finishSnapshot(snapshot)
    await state.ready
    expect(state.data.value.beer).toEqual(['fresh beer'])
    expect(state.data.value.food).toEqual(['saved food'])
  })

  it('retains all saved data when exports are empty or unavailable', async () => {
    const state = createMenuState(() => Promise.resolve(snapshot), {
      dishes: fail, beer: () => Promise.resolve(null), daily: fail,
    })
    await state.ready
    expect(state.data.value).toEqual(snapshot)
    expect(Object.values(state.parts.value)).toEqual(['snapshot', 'snapshot', 'snapshot'])
  })

  it('can show live data even if the snapshot chunk fails', async () => {
    const state = createMenuState(fail, { beer: () => Promise.resolve({ beer: ['fresh beer'] }) })
    await state.ready
    expect(state.data.value.beer).toEqual(['fresh beer'])
    expect(state.loading.value).toBe(false)
  })

  it('uses the actual English menu for German visitors', () => {
    expect(['cs', 'en', 'de'].map(menuLang)).toEqual(['cs', 'en', 'en'])
  })
})
