<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useContent } from '../i18n'
import { bookingUrl, closeReservation, PHONE, PHONE_HREF, reservationOpen } from '../lib/reservation'
import BaseIcon from './BaseIcon.vue'

const { c, locale } = useContent()
const dialog = ref(null)
const loaded = ref(false)
// The widget is only requested once someone actually wants to book.
const requested = ref(false)
const src = computed(() => (requested.value ? bookingUrl(locale.value) : null))

watch(reservationOpen, async (open) => {
  if (open) requested.value = true
  await nextTick()
  const d = dialog.value
  if (!d) return
  if (open && !d.open) d.showModal()
  if (!open && d.open) d.close()
})

watch(src, () => (loaded.value = false))

function onClick(e) {
  if (e.target === dialog.value) closeReservation()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="reservation"
    aria-labelledby="reservation-title"
    @close="closeReservation"
    @click="onClick"
  >
    <div class="panel">
      <header class="head">
        <h2 id="reservation-title" class="display">{{ c.reservation.title }}</h2>
        <button class="close" type="button" :aria-label="c.reservation.close" @click="closeReservation">
          <BaseIcon name="close" />
        </button>
      </header>
      <div class="frame">
        <p v-if="!loaded" class="loading">{{ c.reservation.loading }}</p>
        <iframe
          v-if="src"
          :key="src"
          :src="src"
          :title="c.reservation.frame"
          loading="lazy"
          @load="loaded = true"
        />
      </div>
      <footer class="foot">
        <span>{{ c.reservation.phone }}</span>
        <a class="link" :href="PHONE_HREF"><BaseIcon name="phone" /> {{ PHONE }}</a>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.reservation {
  width: min(560px, calc(100vw - 24px));
  max-height: calc(100dvh - 24px);
  padding: 0;
  border: 0;
  border-radius: 22px;
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 40px 120px -20px rgb(0 0 0 / 0.5);
  overflow: hidden;
}

.reservation[open] {
  animation: pop 0.5s var(--ease);
}

.reservation::backdrop {
  background: rgb(1 12 36 / 0.62);
  backdrop-filter: blur(6px);
  animation: fade 0.4s var(--ease);
}

.panel {
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 24px);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 16px 24px;
  background: var(--navy);
  color: #f4eee3;
}

.head h2 {
  font-size: 1.15rem;
  line-height: 1.1;
}

.close {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.12);
  color: inherit;
  transition: background 0.2s, transform 0.3s var(--ease);
}

.close:hover {
  background: rgb(255 255 255 / 0.22);
  transform: rotate(90deg);
}

.frame {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #fff;
}

.frame iframe {
  width: 100%;
  height: min(640px, calc(100dvh - 190px));
  border: 0;
}

.loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #6a6e7d;
  font-size: 0.95rem;
}

.foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  font-size: 0.92rem;
  color: var(--muted);
  border-top: 1px solid var(--line);
}

.foot .link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.foot svg {
  width: 16px;
  height: 16px;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
}
</style>
