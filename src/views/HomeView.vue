<script setup>
import { onMounted, ref } from 'vue'
import { useContent } from '../i18n'
import { HOURS_ROWS, pragueClock } from '../lib/hours'
import { ADDRESS, MAPS_URL, openReservation, PHONE, PHONE_HREF, SOCIAL } from '../lib/reservation'
import BaseIcon from '../components/BaseIcon.vue'
import BasePhoto from '../components/BasePhoto.vue'
import CountUp from '../components/CountUp.vue'
import DishRail from '../components/DishRail.vue'
import LunchMenu from '../components/LunchMenu.vue'
import OpenStatus from '../components/OpenStatus.vue'
import WordMarquee from '../components/WordMarquee.vue'

const { c, pathFor } = useContent()
const heroIn = ref(false)
const today = pragueClock().day
onMounted(() => requestAnimationFrame(() => (heroIn.value = true)))

const DISHES = [
  'dish-octopus',
  'dish-scallops',
  'dish-prawns',
  'dish-duck',
  'dish-tuna',
  'dish-monkfish',
  'dish-escargots',
  'dish-lamb-boudin',
  'dish-asparagus-carpaccio',
  'dish-gnocchi',
  'dish-calamari',
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero" :class="{ 'is-in': heroIn }">
      <div class="hero-bg">
        <BasePhoto name="interior-bar" eager sizes="100vw" alt="" />
      </div>
      <div class="hero-inner container">
        <p class="eyebrow hero-eyebrow">{{ c.home.hero.eyebrow }}</p>
        <h1 class="display h1 hero-title">
          <span v-for="(line, i) in c.home.hero.title" :key="line" class="rise" :style="{ '--d': `${200 + i * 120}ms` }">
            <span>{{ line }}</span>
          </span>
        </h1>
        <p class="lead hero-lead">{{ c.home.hero.lead }}</p>
        <div class="hero-actions">
          <button class="btn btn--light" type="button" @click="openReservation">
            {{ c.nav.reserveTable }} <BaseIcon name="arrow" />
          </button>
          <RouterLink class="btn btn--ghost" :to="pathFor('menu')">{{ c.home.hero.menu }}</RouterLink>
        </div>
        <div class="hero-meta">
          <OpenStatus />
          <a :href="PHONE_HREF" class="hero-phone"><BaseIcon name="phone" />{{ PHONE }}</a>
        </div>
      </div>
      <a href="#pillars" class="scroll-cue" :aria-label="c.home.hero.scroll">
        <span />
      </a>
    </section>

    <nav class="visit-shortcuts container" :aria-label="c.visitTools.quick">
      <RouterLink :to="{ path: pathFor('menu'), query: { tab: 'lunch' } }"><BaseIcon name="clock" />{{ c.menu.lunchTitle }}</RouterLink>
      <RouterLink :to="{ path: pathFor('beer'), hash: '#pivni-listek' }">{{ c.visitTools.explorer }} <BaseIcon name="arrow" /></RouterLink>
      <a :href="MAPS_URL" target="_blank" rel="noopener"><BaseIcon name="pin" />{{ c.home.visit.route }}</a>
    </nav>

    <WordMarquee :words="c.home.marquee" />

    <!-- Four cornerstones -->
    <section id="pillars" class="section pillars">
      <div class="container">
        <header class="section-head">
          <p v-reveal class="eyebrow">{{ c.home.pillars.eyebrow }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.home.pillars.title }}</h2>
        </header>
        <div class="pillar-grid">
          <article
            v-for="(p, i) in c.home.pillars.items"
            :key="p.key"
            v-reveal="i * 90"
            class="pillar"
            :class="[`pillar--${p.key}`, { 'pillar--text': !p.photo }]"
          >
            <div v-if="p.photo" class="pillar-photo photo">
              <BasePhoto :name="p.photo" alt="" sizes="(min-width: 900px) 33vw, 100vw" />
            </div>
            <div v-else class="fries-art" aria-hidden="true">
              <span v-for="n in 9" :key="n" :style="{ '--n': n, height: `${110 + ((n * 37) % 90)}px` }" />
            </div>
            <div class="pillar-body">
              <p class="pillar-kicker">{{ p.kicker }}</p>
              <h3 class="display h3">{{ p.title }}</h3>
              <p class="pillar-text">{{ p.text }}</p>
            </div>
          </article>
        </div>
        <RouterLink v-reveal class="link more" :to="pathFor('about')">{{ c.home.pillars.more }} →</RouterLink>
      </div>
    </section>

    <!-- Lunch menu (live) -->
    <section id="lunch" class="section lunch-section">
      <div class="container">
        <header class="section-head section-head--row">
          <div>
            <p v-reveal class="eyebrow">{{ c.home.lunch.eyebrow }}</p>
            <h2 v-reveal="80" class="display h2">{{ c.home.lunch.title }}</h2>
            <p v-reveal="140" class="muted lunch-hours"><BaseIcon name="clock" /> {{ c.home.lunch.hours }}</p>
          </div>
          <RouterLink v-reveal class="btn btn--ghost" :to="pathFor('menu')">{{ c.home.lunch.full }}</RouterLink>
        </header>
        <div v-reveal="120">
          <LunchMenu />
        </div>
      </div>
    </section>

    <!-- Numbers -->
    <section class="stats grain">
      <div class="container stat-grid">
        <div v-for="(s, i) in c.home.stats" :key="s.label" v-reveal="i * 80" class="stat">
          <p class="stat-value display"><CountUp :value="s.value" :suffix="s.suffix" /></p>
          <p class="stat-label">{{ s.label }}</p>
        </div>
      </div>
    </section>

    <!-- Dishes -->
    <section class="section dishes">
      <div class="container">
        <header class="section-head section-head--row">
          <div>
            <p v-reveal class="eyebrow">{{ c.home.dishes.eyebrow }}</p>
            <h2 v-reveal="80" class="display h2">{{ c.home.dishes.title }}</h2>
          </div>
          <p v-reveal class="muted hint">{{ c.home.dishes.hint }} ⟷</p>
        </header>
      </div>
      <DishRail :photos="DISHES" />
    </section>

    <!-- Beer quote -->
    <section class="section beer-quote">
      <div class="container beer-grid">
        <div v-reveal class="beer-photo photo reveal-mask">
          <BasePhoto name="beer-robert" :alt="c.home.beer.author" sizes="(min-width: 900px) 40vw, 100vw" :parallax="0.06" />
        </div>
        <div class="beer-copy">
          <p v-reveal class="eyebrow">{{ c.home.beer.eyebrow }}</p>
          <blockquote v-reveal="80" class="quote serif">„{{ c.home.beer.quote }}“</blockquote>
          <p v-reveal="140" class="who">
            <strong>{{ c.home.beer.author }}</strong><br />
            <span class="muted">{{ c.home.beer.role }}</span>
          </p>
          <div v-reveal="200" class="beer-thumbs">
            <div v-for="b in ['beer-orval', 'beer-st-bernardus', 'beer-mort-subite']" :key="b" class="photo thumb">
              <BasePhoto :name="b" alt="" sizes="160px" />
            </div>
          </div>
          <RouterLink v-reveal="240" class="btn" :to="pathFor('beer')">{{ c.home.beer.cta }} <BaseIcon name="arrow" /></RouterLink>
        </div>
      </div>
    </section>

    <!-- Private events -->
    <section class="private">
      <div class="private-bg">
        <BasePhoto name="interior-gallery" alt="" sizes="100vw" :parallax="0.1" />
      </div>
      <div class="container private-inner">
        <div v-reveal class="private-card">
          <p class="eyebrow">{{ c.home.private.eyebrow }}</p>
          <h2 class="display h2">{{ c.home.private.title }}</h2>
          <p class="private-text">{{ c.home.private.text }}</p>
          <a class="btn" :href="PHONE_HREF"><BaseIcon name="phone" /> {{ c.home.private.cta }}</a>
        </div>
      </div>
    </section>

    <!-- Seasonal events -->
    <section class="section events">
      <div class="container">
        <header class="section-head section-head--row">
          <div>
            <p v-reveal class="eyebrow">{{ c.home.events.eyebrow }}</p>
            <h2 v-reveal="80" class="display h2">{{ c.home.events.title }}</h2>
          </div>
          <p v-reveal="120" class="lead events-lead">{{ c.home.events.lead }}</p>
        </header>
        <div class="event-grid">
          <article v-for="(e, i) in c.home.events.items" :key="e.title" v-reveal="i * 100" class="event">
            <div class="photo event-photo">
              <BasePhoto :name="e.photo" alt="" sizes="(min-width: 900px) 33vw, 100vw" />
            </div>
            <h3 class="serif event-title">{{ e.title }}</h3>
          </article>
        </div>
        <div v-reveal class="follow">
          <a class="btn" href="https://www.bruxx.cz/akce/" target="_blank" rel="noopener">{{ c.visitTools.events }} <BaseIcon name="external" /></a>
          <a class="btn btn--ghost" :href="SOCIAL.instagram" target="_blank" rel="noopener"><BaseIcon name="instagram" /> @bruxx_prague</a>
          <a class="btn btn--ghost" :href="SOCIAL.facebook" target="_blank" rel="noopener"><BaseIcon name="facebook" /> restauracebruxx</a>
        </div>
      </div>
    </section>

    <!-- Kids & recipes -->
    <section class="section section--tight teasers">
      <div class="container teaser-grid">
        <RouterLink
          v-for="(t, i) in [
            { key: 'kids', photo: 'kids-table' },
            { key: 'recipes', photo: 'recipe-onion-soup' },
          ]"
          :key="t.key"
          v-reveal="i * 100"
          :to="pathFor(t.key)"
          class="teaser"
        >
          <BasePhoto :name="t.photo" alt="" sizes="(min-width: 900px) 50vw, 100vw" />
          <div class="teaser-body">
            <p class="eyebrow">{{ c.home.teasers[t.key].eyebrow }}</p>
            <h2 class="display h3">{{ c.home.teasers[t.key].title }}</h2>
            <span class="teaser-cta">{{ c.home.teasers[t.key].cta }} <BaseIcon name="arrow" /></span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Visit -->
    <section class="section visit">
      <div class="container visit-grid">
        <div>
          <p v-reveal class="eyebrow">{{ c.home.visit.eyebrow }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.home.visit.title }}</h2>
          <p v-reveal="140" class="lead">{{ ADDRESS.street }}, {{ ADDRESS.city }}</p>
          <div v-reveal="200" class="visit-actions">
            <a class="btn" :href="MAPS_URL" target="_blank" rel="noopener"><BaseIcon name="pin" /> {{ c.home.visit.route }}</a>
            <button class="btn btn--ghost" type="button" @click="openReservation">{{ c.nav.reserveTable }}</button>
          </div>
        </div>
        <div v-reveal="120" class="hours-card">
          <h3 class="hours-title">{{ c.home.visit.hours }}</h3>
          <OpenStatus class="hours-status" />
          <dl class="hours">
            <div
              v-for="row in HOURS_ROWS"
              :key="row.time + row.days"
              class="hours-row"
              :class="{ 'is-today': row.days.includes(today) }"
            >
              <dt>{{ c.daysRange[row.days.join(',')] }}</dt>
              <dd>{{ row.time }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.visit-shortcuts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); padding-block: 20px; gap: 12px; }
.visit-shortcuts a { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 56px; padding: 12px; border: 1px solid var(--line-strong); border-radius: var(--radius-sm); text-decoration: none; font-weight: 600; }
.visit-shortcuts a:hover { background: var(--surface); color: var(--accent); }
.visit-shortcuts svg { width: 20px; flex: none; }
@media (max-width: 560px) { .visit-shortcuts { grid-template-columns: 1fr; gap: 8px; } .visit-shortcuts a { justify-content: space-between; } }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  align-items: end;
  color: #f4eee3;
  overflow: hidden;
  isolation: isolate;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
}

.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.18);
  transition: transform 2.6s var(--ease);
}

.hero.is-in .hero-bg img {
  transform: scale(1.04);
  animation: kenburns 24s 2.6s var(--ease-in-out) infinite alternate;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(120% 80% at 20% 100%, rgb(1 18 50 / 0.86), transparent 70%),
    linear-gradient(180deg, rgb(1 18 50 / 0.5) 0%, rgb(1 18 50 / 0.15) 40%, rgb(1 18 50 / 0.8) 100%);
}

.hero-inner {
  padding-top: calc(var(--header-h) + 64px);
  padding-bottom: clamp(56px, 9vh, 104px);
}

.hero-eyebrow {
  color: var(--brass-soft);
  opacity: 0;
  transform: translateY(12px);
  transition: all 0.9s var(--ease) 0.1s;
}

.hero-title {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  font-size: clamp(2.9rem, 10.4vw, 9.4rem);
}

.hero-title .rise:nth-child(2) {
  padding-left: clamp(0px, 8vw, 140px);
  color: var(--brass-soft);
}

.hero-lead {
  margin-top: 28px;
  color: rgb(244 238 227 / 0.88);
  max-width: 52ch;
}

.hero-lead,
.hero-actions,
.hero-meta {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 1s var(--ease),
    transform 1.2s var(--ease);
}

.hero-lead {
  transition-delay: 0.65s;
}

.hero-actions {
  transition-delay: 0.8s;
}

.hero-meta {
  transition-delay: 0.95s;
}

.hero.is-in .hero-eyebrow,
.hero.is-in .hero-lead,
.hero.is-in .hero-actions,
.hero.is-in .hero-meta {
  opacity: 1;
  transform: none;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
  margin-top: 28px;
  font-size: 0.9rem;
  color: rgb(244 238 227 / 0.86);
}

.hero-phone {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.hero-phone svg {
  width: 16px;
  height: 16px;
}

.scroll-cue {
  position: absolute;
  right: var(--gutter);
  bottom: clamp(56px, 9vh, 104px);
  width: 28px;
  height: 46px;
  border: 1.5px solid rgb(244 238 227 / 0.6);
  border-radius: 999px;
}

.scroll-cue span {
  position: absolute;
  left: 50%;
  top: 9px;
  width: 3px;
  height: 8px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: #f4eee3;
  animation: cue 2s var(--ease) infinite;
}

@keyframes cue {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(16px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

/* ---------- Section heads ---------- */
.section-head {
  display: grid;
  gap: 14px;
  margin-bottom: clamp(36px, 5vw, 64px);
}

.section-head--row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.section-head--row > div {
  display: grid;
  gap: 14px;
}

/* ---------- Pillars ---------- */
.pillar-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.pillar {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.pillar--mussels {
  grid-column: span 7;
}

.pillar--fries {
  grid-column: span 5;
}

.pillar--beer,
.pillar--waffles {
  grid-column: span 6;
}

.pillar-photo {
  aspect-ratio: 16 / 10;
  border-radius: 0;
}

.pillar-photo img {
  transition: transform 1.2s var(--ease);
}

.pillar:hover .pillar-photo img {
  transform: scale(1.06);
}

.pillar-body {
  display: grid;
  gap: 10px;
  padding: clamp(22px, 3vw, 36px);
}

.pillar-kicker {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brass);
}

.pillar-text {
  color: var(--ink-2);
  max-width: 52ch;
}

.pillar--text {
  background: var(--navy);
  color: #f4eee3;
  justify-content: space-between;
}

.pillar--text .pillar-text {
  color: rgb(244 238 227 / 0.82);
}

.pillar--text .pillar-kicker {
  color: var(--brass-soft);
}

/* Fries, drawn: nine golden sticks that tumble in */
.fries-art {
  position: relative;
  flex: 1;
  min-height: 220px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  padding: 40px 40px 0;
}

.fries-art span {
  width: 18px;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, #f3c86b, #d89a3a);
  box-shadow: inset -4px 0 0 rgb(0 0 0 / 0.08);
  transform: rotate(calc((var(--n) - 5) * 3deg)) translateY(120%);
  transition: transform 1.1s var(--ease);
  transition-delay: calc(var(--n) * 60ms);
}

.pillar.is-in .fries-art span {
  transform: rotate(calc((var(--n) - 5) * 3deg));
}

.more {
  display: inline-block;
  margin-top: 32px;
}

/* ---------- Lunch ---------- */
.lunch-section {
  background: var(--paper-2);
}

.lunch-hours {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.lunch-hours svg {
  width: 18px;
  height: 18px;
}

/* ---------- Stats ---------- */
.stats {
  background: var(--navy);
  color: #f4eee3;
  padding-block: clamp(56px, 8vw, 100px);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.stat {
  border-left: 1px solid rgb(244 238 227 / 0.2);
  padding-left: 20px;
}

.stat-value {
  font-size: clamp(2.8rem, 6vw, 5.2rem);
  color: var(--brass-soft);
}

.stat-label {
  margin-top: 8px;
  font-size: 0.95rem;
  color: rgb(244 238 227 / 0.8);
  max-width: 22ch;
}

/* ---------- Dishes ---------- */
.dishes {
  overflow: hidden;
}

.hint {
  font-size: 0.9rem;
}

/* ---------- Beer ---------- */
.beer-quote {
  background: var(--paper-2);
}

.beer-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}

.beer-photo {
  aspect-ratio: 4 / 5;
}

.beer-copy {
  display: grid;
  gap: 24px;
  justify-items: start;
}

.quote {
  font-size: clamp(1.8rem, 3.6vw, 3rem);
  line-height: 1.15;
  color: var(--accent);
}

.who {
  line-height: 1.4;
}

.beer-thumbs {
  display: flex;
  gap: 12px;
}

.thumb {
  width: clamp(72px, 10vw, 110px);
  aspect-ratio: 3 / 4;
  border-radius: 12px;
}

/* ---------- Private ---------- */
.private {
  position: relative;
  min-height: 80vh;
  display: grid;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
  padding-block: clamp(80px, 12vw, 160px);
}

.private-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.private-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.private-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgb(1 18 50 / 0.55), rgb(1 18 50 / 0.1));
}

.private-card {
  display: grid;
  gap: 18px;
  justify-items: start;
  max-width: 520px;
  padding: clamp(28px, 4vw, 52px);
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
}

.private-text {
  color: var(--ink-2);
}

/* ---------- Events ---------- */
.events-lead {
  max-width: 46ch;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.event {
  display: grid;
  gap: 16px;
}

.event-photo {
  aspect-ratio: 4 / 5;
}

.event-photo img {
  transition: transform 1.2s var(--ease);
}

.event:hover .event-photo img {
  transform: scale(1.06);
}

.event-title {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
}

.follow {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 40px;
}

/* ---------- Teasers ---------- */
.teaser-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.teaser {
  position: relative;
  display: block;
  min-height: 440px;
  border-radius: var(--radius);
  overflow: hidden;
  color: #f4eee3;
  text-decoration: none;
  isolation: isolate;
}

.teaser img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  transition: transform 1.2s var(--ease);
}

.teaser::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, transparent 30%, rgb(1 18 50 / 0.85));
}

.teaser:hover img {
  transform: scale(1.06);
}

.teaser-body {
  position: absolute;
  inset: auto 0 0;
  display: grid;
  gap: 10px;
  padding: clamp(24px, 3vw, 40px);
}

.teaser .eyebrow {
  color: var(--brass-soft);
}

.teaser-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-weight: 600;
}

.teaser-cta svg {
  width: 18px;
  transition: transform 0.4s var(--ease);
}

.teaser:hover .teaser-cta svg {
  transform: translateX(6px);
}

/* ---------- Visit ---------- */
.visit-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}

.visit-grid > div:first-child {
  display: grid;
  gap: 18px;
}

.visit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.hours-card {
  padding: clamp(24px, 3vw, 40px);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.hours-title {
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 800;
  text-transform: lowercase;
  font-size: 1.2rem;
}

.hours-status {
  margin-top: 10px;
  color: var(--muted);
}

.hours {
  margin-top: 20px;
}

.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.hours-row dd {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.hours-row.is-today {
  color: var(--accent);
  font-weight: 600;
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .pillar--mussels,
  .pillar--fries,
  .pillar--beer,
  .pillar--waffles {
    grid-column: span 12;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .beer-grid,
  .visit-grid,
  .teaser-grid {
    grid-template-columns: 1fr;
  }

  .beer-photo {
    aspect-ratio: 4 / 4;
  }

  .event-grid {
    grid-template-columns: 1fr;
  }

  .event-photo {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 560px) {
  .scroll-cue {
    display: none;
  }

  .teaser {
    min-height: 360px;
  }

  .stat-grid {
    gap: 28px 16px;
  }

  .stat {
    padding-left: 14px;
  }
}
</style>
