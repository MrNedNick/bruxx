<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
let frame = 0

function update() {
  frame = 0
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  progress.value = max > 0 ? h.scrollTop / max : 0
}
const schedule = () => (frame ||= requestAnimationFrame(update))

onMounted(() => {
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  update()
})
onUnmounted(() => {
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
})
</script>

<template>
  <div class="scroll-progress" aria-hidden="true" :style="{ transform: `scaleX(${progress})` }" />
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  z-index: 60;
  background: var(--brass);
  transform-origin: left;
  transform: scaleX(0);
  will-change: transform;
}
</style>
