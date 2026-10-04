<script setup>
import { computed, ref } from 'vue'
import { useContent } from '../i18n'
import BaseIcon from '../components/BaseIcon.vue'
import BasePhoto from '../components/BasePhoto.vue'
import LightBox from '../components/LightBox.vue'
import PageHero from '../components/PageHero.vue'

const { c } = useContent()

const SETS = {
  kitchen: [
    'dish-octopus',
    'dish-mussels',
    'dish-duck',
    'dish-scallops',
    'dish-tuna',
    'dish-waffle',
    'dish-prawns',
    'dish-monkfish',
    'dish-lamb-boudin',
    'dish-escargots',
    'dish-asparagus-carpaccio',
    'dish-calamari',
    'dish-gnocchi',
    'dish-asparagus-polenta',
  ],
  interior: ['interior-front', 'interior-bar', 'interior-middle', 'interior-stairs', 'interior-gallery'],
  people: ['team-robert-vaverka', 'team-oldrich-matousek', 'team-daniela-hirschova', 'team-bernard-praum'],
  beer: ['beer-robert', 'beer-pour', 'beer-orval', 'beer-st-bernardus', 'beer-mort-subite'],
  kids: ['kids-table', 'kids-balls', 'kids-tunnel', 'kids-blocks', 'kids-corner'],
}

const filter = ref('all')
const shown = computed(() => {
  if (filter.value !== 'all') return SETS[filter.value]
  // Interleave the sets so "all" mixes plates, rooms and people.
  const lists = Object.values(SETS).map((l) => [...l])
  const out = []
  while (lists.some((l) => l.length)) for (const l of lists) if (l.length) out.push(l.shift())
  return out
})

const photoSlides = computed(() => shown.value.map((name) => ({ type: 'photo', name })))
const videoSlides = computed(() => c.value.videos.map((v) => ({ type: 'video', ...v })))

const slides = ref([])
const index = ref(-1)
function openPhoto(i) {
  slides.value = photoSlides.value
  index.value = i
}
function openVideo(i) {
  slides.value = videoSlides.value
  index.value = i
}

const TOUR =
  'https://www.google.cz/maps/@50.0754533,14.4380961,3a,75y,21.99h,94.99t/data=!3m6!1e1!3m4!1sAF1QipN0RzOGQhkEtLPbLuh7gxOVPH2Dz8Z0UQW0o99S!2e10!7i7000!8i3500'
</script>

<template>
  <div class="gallery-page">
    <PageHero photo="interior-middle" :eyebrow="c.gallery.eyebrow" :title="c.gallery.title" :lead="c.gallery.lead" />

    <section class="section section--tight">
      <div class="container">
        <div class="filters" role="group" :aria-label="c.gallery.eyebrow">
          <button
            v-for="(label, key) in c.gallery.filters"
            :key="key"
            type="button"
            class="chip"
            :aria-pressed="filter === key"
            @click="filter = key"
          >
            {{ label }}
          </button>
        </div>

        <TransitionGroup tag="ul" name="tiles" class="masonry" role="list">
          <li v-for="(name, i) in shown" :key="name" class="tile">
            <button type="button" class="tile-btn" @click="openPhoto(i)">
              <BasePhoto :name="name" :alt="c.photoCaptions[name] ?? ''" sizes="(min-width: 1100px) 33vw, (min-width: 640px) 50vw, 100vw" />
              <span class="tile-cap">{{ c.photoCaptions[name] }}</span>
            </button>
          </li>
        </TransitionGroup>
      </div>
    </section>

    <section class="section videos">
      <div class="container">
        <header class="head">
          <h2 v-reveal class="display h2">{{ c.gallery.videos.title }}</h2>
          <p v-reveal="80" class="lead">{{ c.gallery.videos.lead }}</p>
        </header>
        <ul class="video-grid" role="list">
          <li v-for="(v, i) in c.videos" :key="v.id" v-reveal="(i % 3) * 80">
            <button type="button" class="video-btn" :aria-label="`${c.gallery.videos.play}: ${v.title}`" @click="openVideo(i)">
              <span class="video-thumb">
                <img :src="`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`" alt="" loading="lazy" />
                <span class="play"><BaseIcon name="play" /></span>
              </span>
              <span class="video-title">{{ v.title }}</span>
            </button>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <a v-reveal class="tour" :href="TOUR" target="_blank" rel="noopener">
          <BasePhoto name="interior-stairs" alt="" sizes="100vw" />
          <span class="tour-body">
            <span class="display h3">{{ c.gallery.tour.title }}</span>
            <span>{{ c.gallery.tour.text }}</span>
            <span class="btn btn--light">{{ c.gallery.tour.cta }} <BaseIcon name="external" /></span>
          </span>
        </a>
      </div>
    </section>

    <LightBox v-model="index" :slides="slides" />
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 32px;
}

.masonry {
  columns: 3 280px;
  column-gap: 16px;
  margin: 0;
  padding: 0;
}

.tile {
  break-inside: avoid;
  margin-bottom: 16px;
}

.tile-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--paper-2);
  cursor: zoom-in;
}

.tile-btn img {
  width: 100%;
  transition: transform 1.1s var(--ease);
}

.tile-btn:hover img {
  transform: scale(1.05);
}

.tile-cap {
  position: absolute;
  inset: auto 0 0;
  padding: 40px 18px 16px;
  background: linear-gradient(transparent, rgb(1 18 50 / 0.82));
  color: #f4eee3;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.98rem;
  line-height: 1.3;
  text-align: left;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.4s var(--ease),
    transform 0.5s var(--ease);
}

.tile-btn:hover .tile-cap,
.tile-btn:focus-visible .tile-cap {
  opacity: 1;
  transform: none;
}

.tiles-enter-active {
  transition:
    opacity 0.6s var(--ease),
    transform 0.7s var(--ease);
}

.tiles-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.tiles-leave-active {
  display: none;
}

.videos {
  background: var(--paper-2);
}

.head {
  display: grid;
  gap: 14px;
  margin-bottom: 40px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px 16px;
}

.video-btn {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
}

.video-thumb {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: var(--navy);
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1s var(--ease), opacity 0.4s;
  opacity: 0.92;
}

.video-btn:hover .video-thumb img {
  transform: scale(1.06);
  opacity: 1;
}

.play {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  border-radius: 50%;
  background: rgb(244 238 227 / 0.92);
  color: var(--navy);
  transition: transform 0.4s var(--ease), background 0.3s;
}

.play svg {
  width: 22px;
  margin-left: 3px;
}

.video-btn:hover .play {
  transform: scale(1.12);
  background: var(--brass-soft);
}

.video-title {
  font-weight: 600;
  line-height: 1.35;
}

.tour {
  position: relative;
  display: block;
  min-height: 420px;
  border-radius: 24px;
  overflow: hidden;
  color: #f4eee3;
  text-decoration: none;
  isolation: isolate;
}

.tour img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  transition: transform 1.4s var(--ease);
}

.tour:hover img {
  transform: scale(1.05);
}

.tour::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, rgb(1 18 50 / 0.85), rgb(1 18 50 / 0.2));
}

.tour-body {
  position: absolute;
  inset: auto auto 0 0;
  display: grid;
  gap: 14px;
  justify-items: start;
  max-width: 460px;
  padding: clamp(24px, 4vw, 48px);
}

.tour-body svg {
  width: 16px;
}
</style>
