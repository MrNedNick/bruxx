<script setup>
import { computed } from 'vue'
import { photo } from '../lib/photos'

const props = defineProps({
  name: { type: String, required: true },
  alt: { type: String, default: '' },
  sizes: { type: String, default: '(min-width: 900px) 50vw, 100vw' },
  eager: { type: Boolean, default: false },
  parallax: { type: Number, default: 0 },
})

const p = computed(() => photo(props.name))
</script>

<template>
  <img
    v-parallax="parallax"
    :src="p.src"
    :srcset="p.srcset"
    :width="p.width"
    :height="p.height"
    :sizes="sizes"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
  />
</template>
