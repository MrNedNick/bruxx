<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LOCALES, useContent } from '../i18n'
import { openReservation, PHONE, PHONE_HREF } from '../lib/reservation'
import { theme, toggleTheme } from '../lib/theme'
import { headerHidden } from '../lib/ui'
import BaseIcon from './BaseIcon.vue'
import BrandLogo from './BrandLogo.vue'

const { c, locale, pathFor } = useContent()
const route = useRoute()

const NAV = ['menu', 'beer', 'about', 'gallery', 'kids', 'recipes', 'contact']
const page = computed(() => route.meta.page ?? 'home')
const overHero = computed(() => !['privacy', 'notfound'].includes(page.value))

const scrolled = ref(false)
const hidden = ref(false)
const open = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 24
  hidden.value = !open.value && y > 420 && y > lastY + 4
  if (y < lastY - 4 || y < 420) hidden.value = false
  headerHidden.value = hidden.value
  lastY = y
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch(
  () => route.fullPath,
  () => (open.value = false),
)
watch(open, (v) => {
  document.documentElement.style.overflow = v ? 'hidden' : ''
})

function onKey(e) {
  if (e.key === 'Escape' && open.value) open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

function reserve() {
  open.value = false
  openReservation()
}
</script>

<template>
  <header
    class="site-header"
    :class="{
      'is-solid': scrolled || !overHero || open,
      'is-hidden': hidden,
      'is-open': open,
    }"
  >
    <div class="bar container">
      <RouterLink :to="pathFor('home')" class="logo" :aria-label="`Bruxx — ${c.nav.home}`">
        <BrandLogo />
      </RouterLink>

      <nav class="nav" :aria-label="c.nav.main">
        <RouterLink v-for="p in NAV" :key="p" :to="pathFor(p)" class="nav-link">
          {{ c.nav[p] }}
        </RouterLink>
      </nav>

      <div class="tools">
        <div class="langs" role="group" :aria-label="c.nav.language">
          <RouterLink
            v-for="l in LOCALES"
            :key="l.code"
            :to="pathFor(page === 'notfound' ? 'home' : page, l.code)"
            :hreflang="l.code"
            :lang="l.code"
            :aria-current="l.code === locale ? 'true' : undefined"
            :title="l.label"
            class="lang"
          >
            {{ l.short }}
          </RouterLink>
        </div>
        <button
          class="icon-btn"
          type="button"
          :aria-label="theme === 'dark' ? c.nav.themeLight : c.nav.themeDark"
          @click="toggleTheme"
        >
          <BaseIcon :name="theme === 'dark' ? 'sun' : 'moon'" />
        </button>
        <button class="btn btn--sm reserve" type="button" @click="reserve">{{ c.nav.reserve }}</button>
        <button
          class="icon-btn burger"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? c.nav.close : c.nav.open"
          @click="open = !open"
        >
          <span class="burger-lines" aria-hidden="true"><span /><span /></span>
        </button>
      </div>
    </div>

    <Transition name="drawer">
      <div v-if="open" id="mobile-nav" class="drawer">
        <nav class="drawer-nav container" :aria-label="c.nav.main">
          <RouterLink
            v-for="(p, i) in ['home', ...NAV]"
            :key="p"
            :to="pathFor(p)"
            class="drawer-link display"
            :style="{ '--i': i }"
          >
            {{ c.nav[p] }}
          </RouterLink>
        </nav>
        <div class="drawer-foot container">
          <button class="btn btn--light" type="button" @click="reserve">{{ c.nav.reserveTable }}</button>
          <a class="btn btn--ghost" :href="PHONE_HREF"><BaseIcon name="phone" />{{ PHONE }}</a>
          <div class="langs langs--drawer" role="group" :aria-label="c.nav.language">
            <RouterLink
              v-for="l in LOCALES"
              :key="l.code"
              :to="pathFor(page === 'notfound' ? 'home' : page, l.code)"
              :hreflang="l.code"
              :lang="l.code"
              :aria-current="l.code === locale ? 'true' : undefined"
              class="lang"
            >
              {{ l.label }}
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: #f4eee3;
  transition:
    transform 0.5s var(--ease),
    background-color 0.4s var(--ease),
    color 0.4s var(--ease),
    box-shadow 0.4s;
}

.site-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(1 18 50 / 0.45), transparent);
  opacity: 1;
  transition: opacity 0.4s;
  pointer-events: none;
}

.site-header.is-solid {
  color: var(--ink);
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: saturate(1.4) blur(14px);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
  box-shadow: 0 1px 0 var(--line);
}

.site-header.is-solid::before {
  opacity: 0;
}

.site-header.is-open {
  color: #f4eee3;
  background: var(--navy-deep);
  box-shadow: none;
  /* A backdrop filter would make the header the containing block of the
     fixed drawer and clip it to the bar's height. */
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.site-header.is-hidden {
  transform: translateY(-100%);
}

.bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--header-h);
}

.logo {
  width: 108px;
  flex: none;
  color: inherit;
  transition: opacity 0.3s;
}

.is-solid:not(.is-open) .logo {
  color: var(--accent);
}

.logo:hover {
  opacity: 0.8;
}

.nav {
  display: flex;
  gap: 4px;
  margin-inline: auto;
}

.nav-link {
  position: relative;
  padding: 8px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 4px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s var(--ease);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.nav + .tools {
  margin-left: 0;
}

.langs {
  display: flex;
  gap: 2px;
  margin-right: 4px;
}

.lang {
  padding: 6px 7px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-decoration: none;
  opacity: 0.6;
  border-radius: 6px;
  transition: opacity 0.2s;
}

.lang:hover,
.lang[aria-current='true'] {
  opacity: 1;
}

.lang[aria-current='true'] {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  transition: background 0.25s;
}

.icon-btn:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.reserve {
  margin-left: 6px;
}

.burger {
  display: none;
}

.burger-lines {
  position: relative;
  width: 22px;
  height: 10px;
}

.burger-lines span {
  position: absolute;
  left: 0;
  right: 0;
  height: 1.6px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.45s var(--ease), top 0.45s var(--ease);
}

.burger-lines span:first-child {
  top: 0;
}

.burger-lines span:last-child {
  top: 8px;
}

.is-open .burger-lines span:first-child {
  top: 4px;
  transform: rotate(45deg);
}

.is-open .burger-lines span:last-child {
  top: 4px;
  transform: rotate(-45deg);
}

/* Drawer */
.drawer {
  position: fixed;
  inset: var(--header-h) 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  padding-block: 24px 40px;
  overflow-y: auto;
  background: var(--navy-deep);
  color: #f4eee3;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
}

.drawer-link {
  padding-block: 6px;
  font-size: clamp(2.1rem, 9vw, 3.6rem);
  text-decoration: none;
  opacity: 0;
  transform: translateY(24px);
  animation: drawer-in 0.7s var(--ease) forwards;
  animation-delay: calc(80ms + var(--i) * 45ms);
}

.drawer-link.router-link-exact-active {
  color: var(--brass-soft);
}

.drawer-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.langs--drawer {
  width: 100%;
  margin-top: 8px;
}

.langs--drawer .lang {
  font-size: 0.95rem;
  letter-spacing: 0;
  padding: 8px 12px 8px 0;
}

@keyframes drawer-in {
  to {
    opacity: 1;
    transform: none;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    clip-path 0.6s var(--ease),
    opacity 0.3s;
}

.drawer-enter-from,
.drawer-leave-to {
  clip-path: inset(0 0 100% 0);
}

@media (max-width: 1120px) {
  .nav {
    display: none;
  }

  .burger {
    display: grid;
  }

  .tools {
    margin-left: auto !important;
  }
}

@media (max-width: 560px) {
  .tools .langs,
  .reserve {
    display: none;
  }

  .logo {
    width: 92px;
  }
}
</style>
