<script setup>
import { useContent } from '../i18n'
import { PARLAMENT, TOGETHER } from '../lib/reservation'
import BaseIcon from '../components/BaseIcon.vue'
import BasePhoto from '../components/BasePhoto.vue'
import PageHero from '../components/PageHero.vue'
import WordMarquee from '../components/WordMarquee.vue'

const { c } = useContent()
</script>

<template>
  <div class="about-page">
    <PageHero photo="duo-owners" :eyebrow="c.about.eyebrow" :title="c.about.title" :lead="c.about.lead" />

    <section class="section story">
      <div class="container story-grid">
        <div class="story-copy prose">
          <p v-for="(p, i) in c.about.story" :key="i" v-reveal="i * 80" class="story-p">{{ p }}</p>
        </div>
        <div class="story-photos">
          <div v-reveal class="photo reveal-mask p1"><BasePhoto name="interior-front" :alt="c.photoCaptions['interior-front']" /></div>
          <div v-reveal="160" class="photo reveal-mask p2"><BasePhoto name="interior-stairs" :alt="c.photoCaptions['interior-stairs']" /></div>
        </div>
      </div>
    </section>

    <WordMarquee :words="c.home.marquee" reverse />

    <section class="section exclusive">
      <div class="container">
        <header class="head">
          <p v-reveal class="eyebrow">{{ c.about.exclusive.eyebrow }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.about.exclusive.title }}</h2>
        </header>
        <ol class="ex-list" role="list">
          <li v-for="(it, i) in c.about.exclusive.items" :key="it.title" class="ex">
            <span v-reveal class="ex-num display" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="ex-copy">
              <h3 v-reveal="60" class="display h3">{{ it.title }}</h3>
              <p v-reveal="120">{{ it.text }}</p>
            </div>
            <div v-if="it.photo" v-reveal="120" class="photo ex-photo">
              <BasePhoto :name="it.photo" alt="" sizes="(min-width: 900px) 28vw, 100vw" />
            </div>
            <div v-else v-reveal="120" class="ex-photo ex-fries" aria-hidden="true">
              <span class="serif">frites</span>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section team">
      <div class="container">
        <header class="head">
          <p v-reveal class="eyebrow">{{ c.about.team.eyebrow }}</p>
          <h2 v-reveal="80" class="display h2">{{ c.about.team.title }}</h2>
        </header>
        <div class="team-grid">
          <figure v-for="(p, i) in c.about.team.people" :key="p.name" v-reveal="i * 90" class="person">
            <div class="photo person-photo">
              <BasePhoto :name="p.photo" :alt="p.name" sizes="(min-width: 900px) 25vw, 50vw" />
            </div>
            <figcaption>
              <strong>{{ p.name }}</strong>
              <span>{{ p.role }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section--tight together">
      <div class="container together-grid">
        <div v-reveal class="block">
          <h2 class="display h3">{{ c.about.events.title }}</h2>
          <p>{{ c.about.events.text }}</p>
        </div>
        <div v-reveal="100" class="block">
          <h2 class="display h3">{{ c.about.together.title }}</h2>
          <p>{{ c.about.together.text }}</p>
          <div class="links">
            <a class="link" :href="TOGETHER.card" target="_blank" rel="noopener">{{ c.about.together.card }} <BaseIcon name="external" /></a>
            <a class="link" :href="TOGETHER.site" target="_blank" rel="noopener">{{ c.about.together.network }} <BaseIcon name="external" /></a>
            <a class="link" :href="PARLAMENT" target="_blank" rel="noopener">{{ c.about.together.parlament }} <BaseIcon name="external" /></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.story-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
}

.story-p {
  font-size: clamp(1.05rem, 1.5vw, 1.22rem);
}

.story-p:first-child {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  line-height: 1.3;
  color: var(--ink);
}

.story-photos {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

.p1 {
  grid-column: 1 / 6;
  aspect-ratio: 4 / 3;
}

.p2 {
  grid-column: 3 / 7;
  aspect-ratio: 4 / 3;
  margin-top: -18%;
  box-shadow: var(--shadow);
  border: 6px solid var(--paper);
}

.head {
  display: grid;
  gap: 14px;
  margin-bottom: clamp(32px, 5vw, 64px);
}

.ex-list {
  margin: 0;
}

.ex {
  display: grid;
  grid-template-columns: 80px minmax(0, 1.3fr) minmax(0, 1fr);
  gap: clamp(20px, 4vw, 56px);
  align-items: center;
  padding-block: clamp(28px, 4vw, 48px);
  border-top: 1px solid var(--line-strong);
}

.ex-num {
  font-size: 1.1rem;
  color: var(--brass);
  align-self: start;
  padding-top: 6px;
}

.ex-copy {
  display: grid;
  gap: 12px;
}

.ex-copy p {
  color: var(--ink-2);
  max-width: 60ch;
}

.ex-photo {
  aspect-ratio: 16 / 10;
}

.ex-fries {
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  background:
    repeating-linear-gradient(100deg, #e4b45a 0 14px, #d39a3c 14px 18px, transparent 18px 34px),
    var(--navy);
  color: #f4eee3;
}

.ex-fries span {
  padding: 6px 18px;
  border-radius: 999px;
  background: var(--navy);
  font-size: 1.8rem;
}

.team {
  background: var(--paper-2);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.person-photo {
  aspect-ratio: 2 / 3;
}

.person-photo img {
  filter: grayscale(1) contrast(1.05);
  transition: filter 0.8s var(--ease), transform 1.2s var(--ease);
}

.person:hover .person-photo img {
  transform: scale(1.04);
}

.person figcaption {
  display: grid;
  gap: 2px;
  margin-top: 14px;
}

.person strong {
  font-size: 1.08rem;
}

.person span {
  color: var(--muted);
  font-size: 0.92rem;
}

.together-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.block {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: clamp(24px, 3vw, 40px);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.block p {
  color: var(--ink-2);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.links svg {
  display: inline;
  width: 14px;
  height: 14px;
  vertical-align: -1px;
}

@media (max-width: 900px) {
  .story-grid,
  .together-grid {
    grid-template-columns: 1fr;
  }

  .ex {
    grid-template-columns: 48px minmax(0, 1fr);
  }

  .ex-photo {
    grid-column: 2;
  }

  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
