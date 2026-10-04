<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fmt, useContent } from '../i18n'
import { openStatus } from '../lib/hours'

const { c } = useContent()
const now = ref(new Date())
let timer
onMounted(() => (timer = setInterval(() => (now.value = new Date()), 30000)))
onUnmounted(() => clearInterval(timer))

const state = computed(() => openStatus(now.value))
const label = computed(() => {
  const s = state.value
  const t = c.value.status
  if (s.open) return fmt(t.openUntil, { t: s.until })
  if (s.today) return fmt(t.opensToday, { t: s.opensAt })
  return fmt(t.opensOn, { d: t.tomorrow, t: s.opensAt })
})
</script>

<template>
  <span class="open-status" :class="{ 'is-open': state.open }">
    <span class="dot" aria-hidden="true" />
    {{ label }}
  </span>
</template>

<style scoped>
.open-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  white-space: nowrap;
}

.dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9a46a;
}

.is-open .dot {
  background: #3ecf8e;
}

.is-open .dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid #3ecf8e;
  animation: ping 2s var(--ease) infinite;
}

@keyframes ping {
  from {
    transform: scale(0.6);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>
