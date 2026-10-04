<script setup>
import { useContent } from '../i18n'
import { HOURS_ROWS } from '../lib/hours'
import {
  ADDRESS,
  EMAIL,
  MAPS_URL,
  openReservation,
  PARLAMENT,
  PHONE,
  PHONE_HREF,
  SOCIAL,
  TOGETHER,
} from '../lib/reservation'
import BaseIcon from './BaseIcon.vue'
import BrandLogo from './BrandLogo.vue'

const { c, pathFor } = useContent()
const NAV = ['menu', 'beer', 'about', 'gallery', 'kids', 'recipes', 'contact']
const year = new Date().getFullYear()
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="footer grain">
    <div class="container">
      <div class="top">
        <div class="brand">
          <BrandLogo class="logo" />
          <p class="tagline serif">{{ c.footer.tagline }}</p>
          <button class="btn btn--light" type="button" @click="openReservation">
            {{ c.nav.reserveTable }} <BaseIcon name="arrow" />
          </button>
        </div>

        <div class="col">
          <h2 class="col-title">{{ c.footer.explore }}</h2>
          <ul role="list">
            <li v-for="p in NAV" :key="p">
              <RouterLink :to="pathFor(p)">{{ c.nav[p] }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="col">
          <h2 class="col-title">{{ c.footer.visit }}</h2>
          <address>
            <a :href="MAPS_URL" target="_blank" rel="noopener">{{ ADDRESS.street }}<br />{{ ADDRESS.city }}</a>
            <a :href="PHONE_HREF">{{ PHONE }}</a>
            <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
          </address>
        </div>

        <div class="col">
          <h2 class="col-title">{{ c.contact.hours }}</h2>
          <dl class="hours">
            <template v-for="row in HOURS_ROWS" :key="row.time + row.days">
              <dt>{{ c.daysRange[row.days.join(',')] }}</dt>
              <dd>{{ row.time }}</dd>
            </template>
          </dl>
        </div>
      </div>

      <div class="word display" aria-hidden="true">bruxx</div>

      <div class="bottom">
        <p class="together">
          {{ c.footer.together }}
          <a :href="TOGETHER.site" target="_blank" rel="noopener">tgthr.cz</a> ·
          <a :href="TOGETHER.card" target="_blank" rel="noopener">{{ c.about.together.card }}</a> ·
          <a :href="PARLAMENT" target="_blank" rel="noopener">{{ c.about.together.parlament }}</a>
        </p>
        <div class="social">
          <a :href="SOCIAL.facebook" target="_blank" rel="noopener" aria-label="Facebook"><BaseIcon name="facebook" /></a>
          <a :href="SOCIAL.instagram" target="_blank" rel="noopener" aria-label="Instagram"><BaseIcon name="instagram" /></a>
        </div>
      </div>

      <div class="legal">
        <span>© {{ year }} Bruxx · Husa Catering s.r.o. · {{ c.footer.rights }}</span>
        <span class="legal-links">
          <RouterLink :to="pathFor('privacy')">{{ c.footer.privacy }}</RouterLink>
          <button type="button" class="to-top" @click="toTop">{{ c.footer.top }} ↑</button>
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: var(--navy-deep);
  color: #e9e2d3;
  padding-top: clamp(64px, 9vw, 120px);
  overflow: hidden;
}

.top {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 48px 32px;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}

.logo {
  width: 150px;
  color: #f4eee3;
}

.tagline {
  font-size: 1.5rem;
  color: var(--brass-soft);
  margin-bottom: 8px;
}

.col-title {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brass-soft);
  font-weight: 600;
  margin-bottom: 16px;
}

.col ul {
  display: grid;
  gap: 8px;
}

.col a,
address a {
  text-decoration: none;
  color: rgb(233 226 211 / 0.85);
  transition: color 0.2s;
}

.col a:hover,
address a:hover,
.together a:hover,
.legal a:hover {
  color: #fff;
}

address {
  display: grid;
  gap: 12px;
  font-style: normal;
}

.hours {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: start;
  gap: 6px 18px;
  font-size: 0.95rem;
}

.hours dt {
  color: rgb(233 226 211 / 0.7);
}

.hours dd {
  font-variant-numeric: tabular-nums;
}

.word {
  margin: clamp(48px, 7vw, 96px) 0 clamp(24px, 3vw, 40px);
  font-size: clamp(5rem, 24vw, 22rem);
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgb(233 226 211 / 0.22);
  text-align: center;
  user-select: none;
}

.bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-block: 24px;
  border-top: 1px solid rgb(233 226 211 / 0.14);
}

.together {
  max-width: 70ch;
  font-size: 0.92rem;
  color: rgb(233 226 211 / 0.72);
}

.together a,
.legal a {
  color: inherit;
  text-underline-offset: 3px;
}

.social {
  display: flex;
  gap: 8px;
}

.social a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgb(233 226 211 / 0.24);
  border-radius: 50%;
  color: #f4eee3;
  transition: background 0.25s, border-color 0.25s;
}

.social a:hover {
  background: var(--brass);
  border-color: var(--brass);
}

.social svg {
  width: 19px;
  height: 19px;
}

.legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding-block: 20px 32px;
  font-size: 0.82rem;
  color: rgb(233 226 211 / 0.55);
}

.legal-links {
  display: flex;
  gap: 18px;
}

.to-top {
  border: 0;
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

.to-top:hover {
  color: #fff;
}

@media (max-width: 900px) {
  .top {
    grid-template-columns: 1fr 1fr;
  }

  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .top {
    grid-template-columns: 1fr;
  }
}
</style>
