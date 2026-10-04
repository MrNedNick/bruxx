<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useContent } from '../i18n'
import { photo } from '../lib/photos'
import BaseIcon from './BaseIcon.vue'

// Slides are { type: 'photo', name } or { type: 'video', id, title }.
const props = defineProps({ slides: { type: Array, required: true } })
const index = defineModel({ type: Number, default: -1 })
const { c } = useContent()

const dialog = ref(null)
const slide = computed(() => props.slides[index.value])
const src = computed(() => (slide.value?.type === 'photo' ? photo(slide.value.name) : null))

watch(index, async (i) => {
  await nextTick()
  const d = dialog.value
  if (i >= 0 && !d.open) d.showModal()
  if (i < 0 && d.open) d.close()
})

const close = () => (index.value = -1)
const go = (dir) => (index.value = (index.value + dir + props.slides.length) % props.slides.length)

function onKey(e) {
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}

let startX = null
const touchStart = (e) => (startX = e.touches[0].clientX)
function touchEnd(e) {
  if (startX == null) return
  const dx = e.changedTouches[0].clientX - startX
  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  startX = null
}
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="c.gallery.eyebrow"
    @close="close"
    @keydown="onKey"
    @click.self="close"
    @touchstart.passive="touchStart"
    @touchend="touchEnd"
  >
    <template v-if="slide">
      <Transition name="swap" mode="out-in">
        <figure :key="index" class="stage">
          <img
            v-if="slide.type === 'photo'"
            :src="src.src"
            :srcset="src.srcset"
            sizes="92vw"
            :alt="c.photoCaptions[slide.name] ?? ''"
          />
          <div v-else class="video">
            <iframe
              :src="`https://www.youtube-nocookie.com/embed/${slide.id}?autoplay=1&rel=0`"
              :title="slide.title"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowfullscreen
            />
          </div>
          <figcaption>
            <span>{{ slide.type === 'photo' ? c.photoCaptions[slide.name] : slide.title }}</span>
            <span class="counter">{{ index + 1 }} {{ c.gallery.of }} {{ slides.length }}</span>
          </figcaption>
        </figure>
      </Transition>
      <button class="ctrl close" type="button" :aria-label="c.gallery.close" @click="close"><BaseIcon name="close" /></button>
      <button v-if="slides.length > 1" class="ctrl prev" type="button" :aria-label="c.gallery.prev" @click="go(-1)">
        <BaseIcon name="arrowLeft" />
      </button>
      <button v-if="slides.length > 1" class="ctrl next" type="button" :aria-label="c.gallery.next" @click="go(1)">
        <BaseIcon name="arrow" />
      </button>
    </template>
  </dialog>
</template>

<style scoped>
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgb(4 9 22 / 0.96);
  color: #f4eee3;
}

.lightbox[open] {
  display: grid;
  place-items: center;
  animation: fade 0.35s var(--ease);
}

.lightbox::backdrop {
  background: transparent;
}

.stage {
  display: grid;
  gap: 14px;
  justify-items: center;
  max-width: min(92vw, 1500px);
  pointer-events: none;
}

.stage img {
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  width: auto;
  border-radius: 12px;
  object-fit: contain;
  pointer-events: auto;
}

.video {
  width: min(92vw, 1200px);
  aspect-ratio: 16 / 9;
  pointer-events: auto;
}

.video iframe {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 12px;
}

figcaption {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: rgb(244 238 227 / 0.85);
}

.counter {
  flex: none;
  font-family: var(--font-body);
  font-style: normal;
  font-size: 0.85rem;
  color: rgb(244 238 227 / 0.55);
}

.ctrl {
  position: fixed;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgb(244 238 227 / 0.25);
  border-radius: 50%;
  background: rgb(4 9 22 / 0.5);
  color: inherit;
  transition: background 0.2s;
}

.ctrl:hover {
  background: var(--brass);
  border-color: var(--brass);
}

.ctrl svg {
  width: 20px;
}

.close {
  top: 16px;
  right: 16px;
}

.prev {
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.next {
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.3s var(--ease),
    transform 0.4s var(--ease);
}

.swap-enter-from {
  opacity: 0;
  transform: scale(0.97);
}

.swap-leave-to {
  opacity: 0;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .prev,
  .next {
    top: auto;
    bottom: 16px;
    transform: none;
  }

  .stage img {
    max-height: calc(100dvh - 200px);
  }
}
</style>
