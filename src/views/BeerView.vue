<script setup>
import { computed, ref } from 'vue'
import { fmt, useContent } from '../i18n'
import { useMenu } from '../lib/live-menu'
import { beerStrength } from '../lib/menu-filter'
import BasePhoto from '../components/BasePhoto.vue'
import MenuSource from '../components/MenuSource.vue'
import MenuItem from '../components/MenuItem.vue'
import PageHero from '../components/PageHero.vue'

const { c, locale } = useContent()
const menu = useMenu(locale.value)

const style = ref('all')
const strength = ref('all')
const sort = ref('menu')

const styles = computed(() => menu.data.value?.beer ?? [])
const beers = computed(() => {
  const list = styles.value
    .filter((cat) => style.value === 'all' || cat.id === style.value)
    .flatMap((cat) => cat.items.map((item) => ({ ...item, style: cat.title })))
    .filter((b) => b.variants.length && (strength.value === 'all' || beerStrength(b.abv) === strength.value))
  if (sort.value === 'abv') return [...list].sort((a, b) => (b.abv ?? 0) - (a.abv ?? 0))
  if (sort.value === 'price') return [...list].sort((a, b) => a.variants[0].price - b.variants[0].price)
  return list
})
</script>

<template>
  <div class="beer-page">
    <PageHero photo="duo-glasses" :eyebrow="c.beer.eyebrow" :title="c.beer.title" :lead="c.beer.lead">
      <a class="btn btn--light explorer-link" href="#pivni-listek">{{ c.visitTools.explorer }} ↓</a>
    </PageHero>

    <section class="section intro">
      <div class="container intro-grid">
        <div v-reveal class="photo reveal-mask intro-photo">
          <BasePhoto name="beer-robert" :alt="c.beer.intro.name" sizes="(min-width: 900px) 40vw, 100vw" :parallax="0.05" />
        </div>
        <div class="intro-copy">
          <p v-reveal class="eyebrow">{{ c.beer.intro.role }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.beer.intro.name }}</h2>
          <p v-reveal="140" class="lead">{{ c.beer.intro.text }}</p>
        </div>
      </div>
    </section>

    <section class="essays">
      <article
        v-for="(s, i) in c.beer.sections"
        :key="s.title"
        class="essay container"
        :class="{ 'essay--flip': i % 2, 'essay--text': !s.photo }"
      >
        <div v-if="s.photo" v-reveal class="photo reveal-mask essay-photo">
          <BasePhoto :name="s.photo" :alt="c.photoCaptions[s.photo]" sizes="(min-width: 900px) 40vw, 100vw" />
        </div>
        <div class="essay-copy">
          <p v-reveal class="essay-num display" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</p>
          <h3 v-reveal="60" class="display h3">{{ s.title }}</h3>
          <div v-reveal="120" class="prose">
            <p v-for="p in s.paragraphs" :key="p">{{ p }}</p>
          </div>
        </div>
      </article>
    </section>

    <section id="pivni-listek" class="section explorer">
      <div class="container">
        <header class="head">
          <p v-reveal class="eyebrow">{{ c.beer.explorer.eyebrow }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.beer.explorer.title }}</h2>
          <p v-reveal="140" class="lead">{{ c.beer.explorer.lead }}</p>
        </header>

        <MenuSource :menu="menu" part="beer" />
        <p v-if="c.menu.langNote" class="muted">{{ c.menu.langNote }}</p>
        <div class="filters">
          <div class="chips" role="group" :aria-label="c.beer.explorer.eyebrow">
            <button type="button" class="chip" :aria-pressed="style === 'all'" @click="style = 'all'">
              {{ c.beer.explorer.all }}
            </button>
            <button
              v-for="cat in styles"
              :key="cat.id"
              type="button"
              class="chip"
              :aria-pressed="style === cat.id"
              @click="style = cat.id"
            >
              {{ cat.title }}
            </button>
          </div>
          <div class="selects">
            <label>
              <span>{{ c.beer.explorer.strength }}</span>
              <select v-model="strength">
                <option v-for="(label, k) in c.beer.explorer.strengths" :key="k" :value="k">{{ label }}</option>
              </select>
            </label>
            <label>
              <span>{{ c.beer.explorer.sort }}</span>
              <select v-model="sort">
                <option v-for="(label, k) in c.beer.explorer.sorts" :key="k" :value="k">{{ label }}</option>
              </select>
            </label>
            <p class="count muted" role="status">{{ fmt(c.beer.explorer.count, { n: beers.length }) }}</p>
          </div>
        </div>

        <TransitionGroup v-if="beers.length" tag="div" name="cards" class="cards">
          <div v-for="b in beers" :key="b.style + b.name + b.variants[0].size" class="card">
            <p class="card-style">{{ b.style }}</p>
            <MenuItem :item="b" compact />
          </div>
        </TransitionGroup>
        <p v-else class="empty muted">{{ c.beer.explorer.none }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.explorer-link { margin-top: 24px; }

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}

.intro-photo {
  aspect-ratio: 4 / 5;
}

.intro-copy {
  display: grid;
  gap: 18px;
}

.essays {
  display: grid;
  gap: clamp(64px, 9vw, 128px);
  padding-bottom: clamp(72px, 10vw, 140px);
}

.essay {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}

.essay--flip .essay-photo {
  order: 2;
}

.essay--text {
  grid-template-columns: minmax(0, 1fr);
  max-width: 900px;
}

.essay-photo {
  aspect-ratio: 4 / 5;
  max-height: 640px;
}

.essay-copy {
  display: grid;
  gap: 16px;
}

.essay-num {
  font-size: 1rem;
  color: var(--brass);
}

.explorer {
  background: var(--paper-2);
}

.head {
  display: grid;
  gap: 14px;
  margin-bottom: 40px;
}

.filters {
  display: grid;
  gap: 16px;
  margin-bottom: 32px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selects {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
}

.selects label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
}

.selects select {
  height: 40px;
  padding: 0 36px 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--surface)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23888' stroke-width='1.6'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E")
    no-repeat right 14px center;
  appearance: none;
  font-weight: 500;
}

.count {
  margin-left: auto;
  font-size: 0.9rem;
}

.cards {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  padding: 18px 22px 4px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.card :deep(.item) {
  border-bottom: 0;
  padding-top: 4px;
}

.card-style {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brass);
}

.cards-move,
.cards-enter-active {
  transition:
    opacity 0.5s var(--ease),
    transform 0.6s var(--ease);
}

.cards-leave-active {
  display: none;
}

.cards-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.empty {
  padding: 48px 0;
}

@media (max-width: 860px) {
  .intro-grid,
  .essay {
    grid-template-columns: 1fr;
  }

  .essay--flip .essay-photo {
    order: 0;
  }

  .essay-photo,
  .intro-photo {
    aspect-ratio: 4 / 3;
  }

  .count {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 400px) {
  .cards {
    grid-template-columns: 1fr;
  }
}
</style>
