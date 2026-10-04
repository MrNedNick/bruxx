import { createRouter, createWebHistory } from 'vue-router'
import { LOCALES, PAGES, content, locale, pathFor } from '../i18n'
import HomeView from '../views/HomeView.vue'

const views = {
  home: HomeView,
  menu: () => import('../views/MenuView.vue'),
  beer: () => import('../views/BeerView.vue'),
  about: () => import('../views/AboutView.vue'),
  gallery: () => import('../views/GalleryView.vue'),
  kids: () => import('../views/KidsView.vue'),
  recipes: () => import('../views/RecipesView.vue'),
  contact: () => import('../views/ContactView.vue'),
  privacy: () => import('../views/PrivacyView.vue'),
}

// One route per page and language: /piva, /en/beer, /de/bier …
export const routes = [
  ...LOCALES.flatMap(({ code }) =>
    Object.keys(PAGES).map((page) => ({
      path: pathFor(page, code),
      name: `${page}-${code}`,
      component: views[page],
      meta: { page, lang: code },
    })),
  ),
  ...LOCALES.map(({ code }) => ({
    path: code === 'cs' ? '/:pathMatch(.*)*' : `/${code}/:pathMatch(.*)*`,
    name: `notfound-${code}`,
    component: () => import('../views/NotFound.vue'),
    meta: { page: 'notfound', lang: code },
  })),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return new Promise((r) => setTimeout(() => r(saved), 320))
    if (to.hash && !['#rezervace', '#reservation', '#reservierung'].includes(to.hash)) {
      return new Promise((r) => setTimeout(() => r({ el: to.hash, behavior: 'smooth' }), 380))
    }
    if (to.path === from.path) return false
    return new Promise((r) => setTimeout(() => r({ top: 0 }), 260))
  },
})

router.beforeEach((to) => {
  locale.value = to.meta.lang ?? 'cs'
})

router.afterEach((to) => {
  const c = content.value
  document.documentElement.lang = locale.value
  const page = to.meta.page
  const label = page === 'home' || page === 'notfound' ? c.meta.tagline : c.nav[page] ?? c[page]?.title
  document.title = page === 'home' ? `Bruxx — ${c.meta.tagline}` : `${label} · Bruxx`
  document.querySelector('meta[name="description"]')?.setAttribute('content', c.meta.description)
})

export default router
