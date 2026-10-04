<script setup>
import { onMounted, ref } from 'vue'
import BasePhoto from './BasePhoto.vue'

defineProps({
  photo: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
})

const shown = ref(false)
onMounted(() => requestAnimationFrame(() => (shown.value = true)))
</script>

<template>
  <section class="page-hero" :class="{ 'page-hero--plain': !photo, 'is-in': shown }">
    <div v-if="photo" class="page-hero__bg">
      <BasePhoto :name="photo" eager sizes="100vw" alt="" />
    </div>
    <div class="container">
      <p v-if="eyebrow" class="eyebrow hero-fade">{{ eyebrow }}</p>
      <h1 class="display h1 title">
        <span class="rise" style="--d: 120ms"><span>{{ title }}</span></span>
      </h1>
      <p v-if="lead" class="lead hero-fade" style="--d: 420ms">{{ lead }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.title {
  margin-top: 16px;
  max-width: 16ch;
}

.hero-fade {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 1s var(--ease),
    transform 1.1s var(--ease);
  transition-delay: var(--d, 0ms);
}

.is-in .hero-fade {
  opacity: 1;
  transform: none;
}
</style>
