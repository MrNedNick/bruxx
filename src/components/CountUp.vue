<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({ value: { type: Number, required: true }, suffix: { type: String, default: '' } })
const shown = ref(props.value)
const el = ref(null)
let io

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return
  shown.value = 0
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io.disconnect()
    const start = performance.now()
    const dur = 1600
    const tick = (t) => {
      const k = Math.min(1, (t - start) / dur)
      shown.value = Math.round(props.value * (1 - Math.pow(1 - k, 4)))
      if (k < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  io.observe(el.value)
})
onUnmounted(() => io?.disconnect())
</script>

<template>
  <span ref="el" class="count">
    <span aria-hidden="true">{{ shown }}{{ suffix }}</span>
    <span class="sr-only">{{ value }}{{ suffix }}</span>
  </span>
</template>
