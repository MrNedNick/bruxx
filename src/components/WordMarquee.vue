<script setup>
defineProps({
  words: { type: Array, required: true },
  reverse: { type: Boolean, default: false },
})
</script>

<template>
  <div class="marquee" :class="{ reverse }" aria-hidden="true">
    <div class="track">
      <span v-for="n in 2" :key="n" class="run">
        <template v-for="w in words" :key="w + n">
          <span class="word serif">{{ w }}</span>
          <span class="sep">✦</span>
        </template>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  background: var(--band);
  color: var(--on-band);
  padding-block: clamp(16px, 2.4vw, 28px);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.track {
  display: flex;
  width: max-content;
  animation: slide 38s linear infinite;
}

.reverse .track {
  animation-direction: reverse;
}

.marquee:hover .track {
  animation-play-state: paused;
}

.run {
  display: flex;
  align-items: center;
}

.word {
  font-size: clamp(1.8rem, 4.4vw, 3.6rem);
  line-height: 1;
  padding-inline: clamp(16px, 2.4vw, 32px);
  white-space: nowrap;
}

.sep {
  font-size: clamp(0.9rem, 1.6vw, 1.3rem);
  color: var(--brass-soft);
}

@keyframes slide {
  to {
    transform: translateX(-50%);
  }
}
</style>
