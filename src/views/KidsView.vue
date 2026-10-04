<script setup>
import { useContent } from '../i18n'
import { openReservation, PARLAMENT } from '../lib/reservation'
import BaseIcon from '../components/BaseIcon.vue'
import BasePhoto from '../components/BasePhoto.vue'
import PageHero from '../components/PageHero.vue'

const { c } = useContent()
const PHOTOS = ['kids-balls', 'kids-tunnel', 'kids-blocks', 'kids-corner']
</script>

<template>
  <div class="kids-page">
    <PageHero photo="duo-kids" :eyebrow="c.kids.eyebrow" :title="c.kids.title" :lead="c.kids.lead" />

    <section class="section">
      <div class="container kids-grid">
        <div>
          <h2 v-reveal class="display h2">{{ c.kids.schedule.title }}</h2>
          <ol class="timeline" role="list">
            <li v-for="(it, i) in c.kids.schedule.items" :key="it.time" v-reveal="i * 100" class="slot">
              <span class="time display">{{ it.time }}</span>
              <div>
                <h3 class="slot-title">{{ it.title }}</h3>
                <p>{{ it.text }}</p>
              </div>
            </li>
          </ol>
          <p v-reveal class="note muted">{{ c.kids.note }}</p>
          <div v-reveal class="actions">
            <button class="btn" type="button" @click="openReservation">{{ c.kids.cta }} <BaseIcon name="arrow" /></button>
            <a class="link" :href="PARLAMENT" target="_blank" rel="noopener">Vinohradský parlament</a>
          </div>
        </div>
        <div v-reveal="120" class="photo reveal-mask hero-photo">
          <BasePhoto name="kids-table" :alt="c.photoCaptions['kids-table']" sizes="(min-width: 900px) 40vw, 100vw" :parallax="0.05" />
        </div>
      </div>
    </section>

    <section class="section section--tight strip">
      <div class="container strip-grid">
        <div v-for="(p, i) in PHOTOS" :key="p" v-reveal="i * 90" class="photo strip-photo">
          <BasePhoto :name="p" :alt="c.photoCaptions[p]" sizes="(min-width: 900px) 25vw, 50vw" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.kids-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
}

.timeline {
  display: grid;
  gap: 0;
  margin: 32px 0 0;
}

.slot {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 20px;
  padding-block: 24px;
  border-top: 1px solid var(--line-strong);
}

.time {
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  color: var(--accent);
}

.slot-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: 1.45rem;
  margin-bottom: 6px;
}

.slot p {
  color: var(--ink-2);
}

.note {
  margin-top: 8px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
  margin-top: 32px;
}

.hero-photo {
  aspect-ratio: 2 / 3;
  position: sticky;
  top: calc(var(--header-h) + 24px);
}

.strip {
  background: var(--paper-2);
}

.strip-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.strip-photo {
  aspect-ratio: 2 / 3;
}

.strip-photo:nth-child(even) {
  margin-top: 40px;
}

@media (max-width: 860px) {
  .kids-grid {
    grid-template-columns: 1fr;
  }

  .hero-photo {
    position: static;
    aspect-ratio: 4 / 3;
  }

  .strip-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .slot {
    grid-template-columns: 90px minmax(0, 1fr);
  }
}
</style>
