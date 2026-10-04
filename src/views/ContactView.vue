<script setup>
import { ref } from 'vue'
import { useContent } from '../i18n'
import { HOURS_ROWS, pragueClock } from '../lib/hours'
import { ADDRESS, EMAIL, MAPS_EMBED, MAPS_URL, openReservation, PHONE, PHONE_HREF, SOCIAL } from '../lib/reservation'
import BaseIcon from '../components/BaseIcon.vue'
import OpenStatus from '../components/OpenStatus.vue'
import PageHero from '../components/PageHero.vue'

const { c } = useContent()
const today = pragueClock().day
// Google Maps sets cookies, so it only loads once the visitor asks for it.
const mapLoaded = ref(false)
</script>

<template>
  <div class="contact-page">
    <PageHero photo="interior-front" :eyebrow="c.contact.eyebrow" :title="c.contact.title" :lead="c.contact.lead">
      <OpenStatus class="hero-status" />
    </PageHero>

    <section class="section">
      <div class="container grid">
        <div class="cards">
          <a v-reveal class="card" :href="MAPS_URL" target="_blank" rel="noopener">
            <BaseIcon name="pin" />
            <span class="label">{{ c.contact.address }}</span>
            <span class="value">{{ ADDRESS.street }}<br />{{ ADDRESS.city }}</span>
          </a>
          <a v-reveal="80" class="card" :href="PHONE_HREF">
            <BaseIcon name="phone" />
            <span class="label">{{ c.contact.phone }}</span>
            <span class="value">{{ PHONE }}</span>
          </a>
          <a v-reveal="160" class="card" :href="`mailto:${EMAIL}`">
            <BaseIcon name="mail" />
            <span class="label">{{ c.contact.email }}</span>
            <span class="value">{{ EMAIL }}</span>
          </a>
        </div>

        <div v-reveal="120" class="hours-card">
          <h2 class="display h3">{{ c.contact.hours }}</h2>
          <dl>
            <div
              v-for="row in HOURS_ROWS"
              :key="row.time + row.days"
              class="row"
              :class="{ 'is-today': row.days.includes(today) }"
            >
              <dt>
                {{ c.daysRange[row.days.join(',')] }}
                <span v-if="row.days.includes(today)" class="today">{{ c.contact.today }}</span>
              </dt>
              <dd>{{ row.time }}</dd>
            </div>
          </dl>
          <p class="muted lunch">{{ c.menu.lunchTitle }}: {{ c.menu.lunchHours }}</p>
        </div>
      </div>
    </section>

    <section class="map-section">
      <div class="container">
        <div v-reveal class="map">
          <iframe
            v-if="mapLoaded"
            :src="MAPS_EMBED"
            :title="c.contact.mapTitle"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
          <div v-else class="map-placeholder">
            <div class="streets" aria-hidden="true" />
            <span class="pin" aria-hidden="true"><BaseIcon name="pin" /></span>
            <div class="map-actions">
              <button class="btn btn--light" type="button" @click="mapLoaded = true">{{ c.contact.showMap }}</button>
              <a class="btn btn--ghost" :href="MAPS_URL" target="_blank" rel="noopener">{{ c.contact.route }} <BaseIcon name="external" /></a>
            </div>
            <p class="map-note">{{ c.contact.mapNote }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container info-grid">
        <div v-reveal class="block">
          <h2 class="display h3">{{ c.contact.getting.title }}</h2>
          <dl class="getting">
            <div v-for="g in c.contact.getting.items" :key="g.label">
              <dt>{{ g.label }}</dt>
              <dd>{{ g.text }}</dd>
            </div>
          </dl>
        </div>
        <div v-reveal="80" class="block block--navy">
          <h2 class="display h3">{{ c.contact.reserveTitle }}</h2>
          <p>{{ c.contact.reserveText }}</p>
          <div class="actions">
            <button class="btn btn--light" type="button" @click="openReservation">{{ c.nav.reserveTable }}</button>
            <a class="btn btn--ghost" :href="PHONE_HREF"><BaseIcon name="phone" /> {{ PHONE }}</a>
          </div>
        </div>
        <div v-reveal="160" class="block">
          <h2 class="display h3">{{ c.contact.operator }}</h2>
          <p class="company">
            <template v-for="line in c.contact.company" :key="line">{{ line }}<br /></template>
          </p>
          <p class="social-title">{{ c.contact.social }}</p>
          <div class="social">
            <a :href="SOCIAL.facebook" target="_blank" rel="noopener" aria-label="Facebook"><BaseIcon name="facebook" /></a>
            <a :href="SOCIAL.instagram" target="_blank" rel="noopener" aria-label="Instagram"><BaseIcon name="instagram" /></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-status {
  margin-top: 24px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgb(1 18 50 / 0.5);
  backdrop-filter: blur(8px);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 20px;
  align-items: start;
}

.cards {
  display: grid;
  gap: 12px;
}

.card {
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
  align-items: center;
  padding: 22px 24px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-decoration: none;
  transition: transform 0.4s var(--ease);
}

.card:hover {
  transform: translateY(-3px);
}

.card svg {
  grid-row: span 2;
  width: 48px;
  height: 48px;
  padding: 12px;
  border-radius: 50%;
  background: var(--navy);
  color: #f4eee3;
}

.label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brass);
}

.value {
  font-size: 1.15rem;
  font-weight: 600;
}

.hours-card {
  padding: clamp(24px, 3vw, 40px);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.hours-card dl {
  margin-top: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid var(--line);
}

.row dd {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.row.is-today {
  color: var(--accent);
  font-weight: 600;
}

.today {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--navy);
  color: #f4eee3;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.lunch {
  margin-top: 16px;
  font-size: 0.9rem;
}

.map {
  height: clamp(360px, 50vw, 520px);
  border-radius: 24px;
  overflow: hidden;
  background: var(--navy);
}

.map iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.map-placeholder {
  position: relative;
  height: 100%;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 18px;
  padding: 24px;
  color: #f4eee3;
  text-align: center;
  isolation: isolate;
}

.streets {
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.35;
  background:
    linear-gradient(28deg, transparent 47%, rgb(244 238 227 / 0.5) 47.5%, rgb(244 238 227 / 0.5) 48.5%, transparent 49%),
    linear-gradient(118deg, transparent 47%, rgb(244 238 227 / 0.4) 47.5%, rgb(244 238 227 / 0.4) 48.3%, transparent 49%),
    linear-gradient(0deg, transparent 49%, rgb(244 238 227 / 0.25) 49.5%, rgb(244 238 227 / 0.25) 50.5%, transparent 51%),
    repeating-linear-gradient(90deg, transparent 0 78px, rgb(244 238 227 / 0.12) 78px 80px),
    repeating-linear-gradient(0deg, transparent 0 62px, rgb(244 238 227 / 0.12) 62px 64px);
}

.pin {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--brass);
  box-shadow: 0 0 0 12px rgb(214 176 111 / 0.25);
  animation: bob 2.4s var(--ease-in-out) infinite alternate;
}

.pin svg {
  width: 28px;
}

.map-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.map-actions svg {
  width: 16px;
}

.map-note {
  font-size: 0.85rem;
  opacity: 0.7;
}

@keyframes bob {
  to {
    transform: translateY(-8px);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.block {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: clamp(24px, 3vw, 36px);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.block--navy {
  background: var(--navy);
  color: #f4eee3;
}

.block--navy p {
  color: rgb(244 238 227 / 0.84);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.getting div {
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.getting dt {
  font-weight: 700;
}

.getting dd {
  color: var(--ink-2);
}

.company {
  color: var(--ink-2);
  line-height: 1.7;
}

.social-title {
  font-weight: 600;
  margin-top: 6px;
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
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  transition: background 0.25s, color 0.25s, border-color 0.25s;
}

.social a:hover {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}

.social svg {
  width: 19px;
}

@media (max-width: 960px) {
  .grid,
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
