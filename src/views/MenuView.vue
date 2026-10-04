<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fmt, useContent } from '../i18n'
import { useMenu } from '../lib/live-menu'
import { filterCategories } from '../lib/menu-filter'
import { headerHidden } from '../lib/ui'
import BaseIcon from '../components/BaseIcon.vue'
import LunchMenu from '../components/LunchMenu.vue'
import MenuItem from '../components/MenuItem.vue'
import PageHero from '../components/PageHero.vue'

const { c, locale, intl } = useContent()
const route = useRoute()
const router = useRouter()

const TABS = ['lunch', 'food', 'drinks', 'wine', 'beer']
const tab = computed(() => (TABS.includes(route.query.tab) ? route.query.tab : 'food'))
const toolbar = ref(null)
async function setTab(t) {
  await router.replace({ query: { ...route.query, tab: t }, hash: '' })
  // Start the new list from its top rather than mid-way down the old one.
  const top = toolbar.value?.offsetTop ?? 0
  if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
}
function onTabKey(e) {
  const i = TABS.indexOf(tab.value)
  const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null
  if (next == null) return
  const t = TABS[(next + TABS.length) % TABS.length]
  setTab(t)
  nextTick(() => document.getElementById(`tab-${t}`)?.focus())
}

const menu = useMenu(locale.value)
const data = menu.data

const query = ref('')
const excluded = ref([])
const filterOpen = ref(false)

const categories = computed(() =>
  filterCategories(data.value?.[tab.value] ?? [], { query: query.value, excluded: excluded.value }),
)
const total = computed(() => categories.value.reduce((n, cat) => n + cat.items.length, 0))

const sourceLabel = computed(() => {
  if (menu.source.value === 'live') return c.value.menu.live
  const at = menu.updatedAt.value
  if (!at) return ''
  const d = new Intl.DateTimeFormat(intl.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(at))
  return fmt(c.value.menu.snapshot, { d })
})

function toggleAllergen(n) {
  excluded.value = excluded.value.includes(n) ? excluded.value.filter((x) => x !== n) : [...excluded.value, n]
}

// Scrollspy: highlight the category in view and keep its chip visible.
const active = ref('')
const chips = ref(null)
let io
function observe() {
  io?.disconnect()
  io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) active.value = visible[0].target.id
    },
    { rootMargin: '-35% 0px -55% 0px' },
  )
  document.querySelectorAll('.menu-cat').forEach((el) => io.observe(el))
}
watch(active, async (id) => {
  await nextTick()
  const chip = chips.value?.querySelector(`[data-id="${id}"]`)
  if (chip && chips.value) {
    const box = chips.value
    box.scrollTo({ left: chip.offsetLeft - box.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
  }
})
watch(categories, () => nextTick(observe), { flush: 'post' })
onMounted(() => nextTick(observe))
onUnmounted(() => io?.disconnect())

function jump(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="menu-page">
    <PageHero photo="dish-mussels" :eyebrow="c.menu.eyebrow" :title="c.menu.title" :lead="c.menu.lead" />

    <div ref="toolbar" class="toolbar" :class="{ 'is-raised': headerHidden }">
      <div class="container">
        <div class="tabs" role="tablist" :aria-label="c.menu.title" @keydown="onTabKey">
          <button
            v-for="t in TABS"
            :id="`tab-${t}`"
            :key="t"
            role="tab"
            type="button"
            class="tab"
            :aria-selected="tab === t"
            :tabindex="tab === t ? 0 : -1"
            :aria-controls="`panel-${t}`"
            @click="setTab(t)"
          >
            {{ c.menu.tabs[t] }}
          </button>
        </div>
        <div v-if="tab !== 'lunch'" class="tools">
          <div ref="chips" class="chips" :aria-label="c.menu.jump" role="navigation">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="chip"
              :data-id="cat.id"
              :class="{ 'is-active': active === cat.id }"
              @click="jump(cat.id)"
            >
              {{ cat.title }}
            </button>
          </div>
          <div class="search">
            <BaseIcon name="search" />
            <label class="sr-only" for="menu-search">{{ c.menu.search }}</label>
            <input id="menu-search" v-model="query" type="search" :placeholder="c.menu.searchPlaceholder" autocomplete="off" />
          </div>
          <button
            v-if="tab === 'food'"
            class="chip filter-btn"
            type="button"
            :aria-expanded="filterOpen"
            aria-controls="allergen-filter"
            :aria-pressed="excluded.length > 0"
            @click="filterOpen = !filterOpen"
          >
            <BaseIcon name="filter" /> {{ c.menu.allergens }}<span v-if="excluded.length" class="count">{{ excluded.length }}</span>
          </button>
        </div>
        <Transition name="fold">
          <div v-if="filterOpen && tab === 'food'" id="allergen-filter" class="allergen-filter">
            <p class="filter-title">{{ c.menu.exclude }}:</p>
            <div class="filter-chips">
              <button
                v-for="n in 14"
                :key="n"
                type="button"
                class="chip chip--sm"
                :aria-pressed="excluded.includes(n)"
                @click="toggleAllergen(n)"
              >
                <span class="num">{{ n }}</span> {{ c.allergens[n] }}
              </button>
            </div>
            <button v-if="excluded.length" type="button" class="link clear" @click="excluded = []">{{ c.menu.clear }}</button>
          </div>
        </Transition>
      </div>
    </div>

    <section :id="`panel-${tab}`" class="section section--tight" role="tabpanel" :aria-labelledby="`tab-${tab}`">
      <div class="container">
        <p class="source">
          <span class="source-dot" :class="{ live: menu.source.value === 'live' }" aria-hidden="true" />
          {{ sourceLabel }}
          <span v-if="tab !== 'lunch' && data" class="muted">· {{ fmt(c.menu.items, { n: total }) }}</span>
        </p>
        <p v-if="c.menu.langNote" class="lang-note muted">{{ c.menu.langNote }}</p>

        <template v-if="tab === 'lunch'">
          <h2 class="display h2 lunch-title">{{ c.menu.lunchTitle }}</h2>
          <p class="muted lunch-hours">{{ c.menu.lunchHours }}</p>
          <LunchMenu />
        </template>

        <template v-else-if="data">
          <section v-for="cat in categories" :id="cat.id" :key="cat.id" class="menu-cat">
            <header class="cat-head">
              <h2 class="display cat-title">{{ cat.title }}</h2>
              <p v-if="cat.note" class="cat-note serif">{{ cat.note }}</p>
            </header>
            <div class="items">
              <MenuItem v-for="(item, i) in cat.items" :key="item.name + i" :item="item" />
            </div>
          </section>
          <p v-if="!categories.length" class="empty">{{ c.menu.none }}</p>
        </template>

        <details v-if="tab === 'food' || tab === 'lunch'" class="legend">
          <summary>{{ c.menu.allergensTitle }}</summary>
          <p class="muted">{{ c.menu.allergensNote }}</p>
          <ol class="legend-list">
            <li v-for="n in 14" :key="n"><span class="num">{{ n }}</span> {{ c.allergens[n] }}</li>
          </ol>
        </details>
      </div>
    </section>
  </div>
</template>

<style scoped>
.toolbar {
  position: sticky;
  top: var(--header-h);
  z-index: 20;
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  transition: top 0.5s var(--ease);
}

.toolbar.is-raised {
  top: 0;
}

.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-top: 12px;
}

.tabs::-webkit-scrollbar,
.chips::-webkit-scrollbar {
  display: none;
}

.tab {
  position: relative;
  flex: none;
  padding: 12px 16px;
  border: 0;
  background: none;
  font-family: var(--font-display);
  font-stretch: 112%;
  font-weight: 700;
  font-size: 1rem;
  text-transform: lowercase;
  color: var(--muted);
  transition: color 0.25s;
}

.tab::after {
  content: '';
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform 0.45s var(--ease);
}

.tab[aria-selected='true'] {
  color: var(--ink);
}

.tab[aria-selected='true']::after {
  transform: scaleX(1);
}

.tools {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-block: 12px;
  border-top: 1px solid var(--line);
}

.chips {
  display: flex;
  gap: 6px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(90deg, #000 90%, transparent);
}

.chips .chip {
  min-height: 36px;
  font-size: 0.86rem;
}

.search {
  position: relative;
  flex: none;
  width: 220px;
}

.search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  color: var(--muted);
}

.search input {
  width: 100%;
  height: 40px;
  padding: 0 14px 0 40px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--surface);
}

.search input:focus {
  outline: none;
  border-color: var(--accent);
}

.filter-btn svg {
  width: 16px;
  height: 16px;
}

.filter-btn .count {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--brass);
  color: #fff;
  font-size: 0.72rem;
}

.allergen-filter {
  padding: 4px 0 16px;
}

.filter-title {
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip--sm {
  min-height: 34px;
  padding: 0 12px;
  font-size: 0.84rem;
}

.num {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid currentColor;
  font-size: 0.7rem;
  font-weight: 700;
}

.clear {
  margin-top: 12px;
  border: 0;
  padding: 0;
  font-size: 0.9rem;
}

.fold-enter-active,
.fold-leave-active {
  transition: opacity 0.3s, transform 0.4s var(--ease);
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.source {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.86rem;
  color: var(--ink-2);
  margin-bottom: 8px;
}

.source-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brass);
}

.source-dot.live {
  background: #3ecf8e;
  box-shadow: 0 0 0 4px rgb(62 207 142 / 0.2);
}

.lang-note {
  font-size: 0.86rem;
}

.lunch-title {
  margin-top: 32px;
}

.lunch-hours {
  margin: 10px 0 32px;
}

.menu-cat {
  padding-top: clamp(40px, 5vw, 72px);
  scroll-margin-top: calc(var(--header-h) + 130px);
}

.cat-head {
  display: grid;
  gap: 12px;
  margin-bottom: 8px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--ink);
}

.cat-title {
  font-size: clamp(1.7rem, 3.6vw, 2.8rem);
}

.cat-note {
  font-size: 1.08rem;
  color: var(--ink-2);
  max-width: 70ch;
}

.items {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(32px, 5vw, 72px);
}

.empty {
  padding: 64px 0;
  font-size: 1.1rem;
  color: var(--muted);
}

.legend {
  margin-top: 64px;
  padding: 20px 24px;
  border-radius: var(--radius);
  background: var(--surface);
}

.legend summary {
  cursor: pointer;
  font-weight: 600;
}

.legend .muted {
  margin-top: 10px;
  font-size: 0.9rem;
}

.legend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px 24px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.92rem;
}

.legend-list li {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 860px) {
  .items {
    grid-template-columns: 1fr;
  }

  .tools {
    flex-wrap: wrap;
  }

  .chips {
    order: 3;
    flex-basis: 100%;
  }

  .search {
    flex: 1;
    width: auto;
  }
}
</style>
