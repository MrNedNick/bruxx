<script setup>
import { computed } from 'vue'
import { fmt, useContent } from '../i18n'

const props = defineProps({ menu: { type: Object, required: true }, part: { type: String, required: true } })
const { c, intl } = useContent()
const state = computed(() => props.menu.parts.value[props.part])
const label = computed(() => {
  if (state.value === 'live') return c.value.menu.live
  const at = props.menu.updatedAt.value
  if (!at) return c.value.visitTools.check
  const d = new Intl.DateTimeFormat(intl.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(at))
  return fmt(c.value.menu.snapshot, { d })
})
const original = computed(() => props.part === 'daily' ? 'https://www.bruxx.cz/' : 'https://www.bruxx.cz/menu/')
</script>

<template>
  <div class="menu-source" role="status">
    <p><span class="dot" :class="{ live: state === 'live' }" aria-hidden="true" />{{ label }}</p>
    <p v-if="state === 'snapshot'" class="fallback">{{ c.visitTools.fallback }} <a :href="original" target="_blank" rel="noopener">{{ c.visitTools.original }} ↗</a></p>
  </div>
</template>

<style scoped>
.menu-source { margin-bottom: 16px; font-size: 0.86rem; color: var(--ink-2); }
.menu-source p { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.dot { width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--brass); }
.dot.live { background: #23965e; }
.fallback { margin-top: 6px; max-width: 75ch; }
.fallback a { color: var(--accent); text-underline-offset: 3px; }
</style>
