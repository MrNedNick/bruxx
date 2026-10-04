<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useContent } from '../i18n'
import BaseIcon from './BaseIcon.vue'
import BasePhoto from './BasePhoto.vue'

defineProps({ photos: { type: Array, required: true } })
const { c } = useContent()

const rail = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

// Mouse drag scrolls the rail; touch and trackpads use native scrolling.
let drag = null
function down(e) {
  if (e.pointerType !== 'mouse') return
  drag = { x: e.clientX, left: rail.value.scrollLeft, moved: false }
  rail.value.classList.add('is-dragging')
}
function move(e) {
  if (!drag) return
  const dx = e.clientX - drag.x
  if (Math.abs(dx) > 4) drag.moved = true
  rail.value.scrollLeft = drag.left - dx
}
function up() {
  if (!drag) return
  rail.value.classList.remove('is-dragging')
  setTimeout(() => (drag = null))
}
function clickCapture(e) {
  if (drag?.moved) e.preventDefault()
}

function update() {
  const r = rail.value
  if (!r) return
  atStart.value = r.scrollLeft < 8
  atEnd.value = r.scrollLeft + r.clientWidth > r.scrollWidth - 8
}

function step(dir) {
  const r = rail.value
  const card = r.querySelector('.card')
  r.scrollBy({ left: dir * (card ? card.offsetWidth + 20 : r.clientWidth * 0.8), behavior: 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('pointerup', up)
  window.addEventListener('resize', update)
})
onUnmounted(() => {
  window.removeEventListener('pointerup', up)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="rail-wrap">
    <ul
      ref="rail"
      class="rail"
      role="list"
      @scroll.passive="update"
      @pointerdown="down"
      @pointermove="move"
      @click.capture="clickCapture"
      @dragstart.prevent
    >
      <li v-for="(p, i) in photos" :key="p" v-reveal="Math.min(i, 4) * 70" class="card">
        <figure>
          <div class="photo card-photo">
            <BasePhoto :name="p" :alt="c.photoCaptions[p]" sizes="(min-width: 900px) 30vw, 80vw" />
          </div>
          <figcaption>{{ c.photoCaptions[p] }}</figcaption>
        </figure>
      </li>
    </ul>
    <div class="container controls">
      <button class="arrow" type="button" :disabled="atStart" :aria-label="c.gallery.prev" @click="step(-1)">
        <BaseIcon name="arrowLeft" />
      </button>
      <button class="arrow" type="button" :disabled="atEnd" :aria-label="c.gallery.next" @click="step(1)">
        <BaseIcon name="arrow" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.rail {
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0 var(--gutter) 8px;
  padding-inline-start: max(var(--gutter), calc((100vw - var(--max)) / 2 + var(--gutter)));
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: max(var(--gutter), calc((100vw - var(--max)) / 2 + var(--gutter)));
  scrollbar-width: none;
  cursor: grab;
  user-select: none;
}

.rail::-webkit-scrollbar {
  display: none;
}

.rail.is-dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}

.card {
  flex: none;
  width: clamp(260px, 30vw, 420px);
  scroll-snap-align: start;
}

.card:nth-child(even) {
  margin-top: clamp(24px, 4vw, 56px);
}

.card-photo {
  aspect-ratio: 4 / 5;
}

.card-photo img {
  pointer-events: none;
  transition: transform 1.2s var(--ease);
}

.card:hover .card-photo img {
  transform: scale(1.05);
}

figcaption {
  margin-top: 14px;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.08rem;
  line-height: 1.35;
  color: var(--ink-2);
}

.controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
}

.arrow {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: transparent;
  transition: background 0.25s, color 0.25s, opacity 0.25s, border-color 0.25s;
}

.arrow:hover:not(:disabled) {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

.arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.arrow svg {
  width: 20px;
}
</style>
