import { shallowRef, ref } from 'vue'
import { menubotUrls, parseDailyMenu, parseStandardMenu, splitDishes } from './menubot'

// The restaurant edits its menu in Menubot. Menubot serves it as scripts that
// document.write() HTML and sends no CORS headers, so it cannot be fetched —
// but it can be run. Each script runs in its own blank iframe whose
// document.write we replace, so its globals and side effects stay there.
export function captureScript(url, timeout = 12000) {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe')
    frame.hidden = true
    frame.tabIndex = -1
    frame.setAttribute('aria-hidden', 'true')
    frame.title = 'menu loader'
    document.body.appendChild(frame)

    const doc = frame.contentDocument
    doc.open()
    doc.write('<!doctype html><html><head></head><body></body></html>')
    doc.close()

    let out = ''
    doc.write = (...a) => (out += a.join(''))
    doc.writeln = (...a) => (out += a.join('') + '\n')

    let timer
    const finish = (err) => {
      clearTimeout(timer)
      frame.remove()
      if (err) reject(err)
      else if (!out) reject(new Error(`${url} wrote nothing`))
      else resolve(out)
    }
    const s = doc.createElement('script')
    // Menubot caches aggressively; a ten-minute bucket keeps it fresh enough.
    s.src = `${url}?v=${Math.floor(Date.now() / 600000)}`
    s.onload = () => finish()
    s.onerror = () => finish(new Error(`${url} failed to load`))
    timer = setTimeout(() => finish(new Error(`${url} timed out`)), timeout)
    doc.head.appendChild(s)
  })
}

const toRoot = (html) => new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body

const snapshots = {
  cs: () => import('../data/menu-cs.json'),
  en: () => import('../data/menu-en.json'),
}

// The menu exists in Czech and English; other site languages use English.
export const menuLang = (lang) => (lang === 'cs' ? 'cs' : 'en')

const cache = {}

/**
 * Reactive menu for a language: the build-time snapshot first, replaced part
 * by part with the live Menubot data as it arrives.
 * `source` is 'snapshot' until at least one live part has loaded, then 'live'.
 */
export function useMenu(lang) {
  const key = menuLang(lang)
  if (cache[key]) return cache[key]

  const state = {
    data: shallowRef(null),
    source: ref('snapshot'),
    loading: ref(true),
    updatedAt: ref(null),
  }
  cache[key] = state

  snapshots[key]().then((m) => {
    const snap = m.default ?? m
    // Live parts that already arrived win; the snapshot fills in the rest.
    state.data.value = { ...snap, ...(state.data.value ?? {}) }
    if (state.source.value === 'snapshot') state.updatedAt.value = snap.syncedAt
  })

  const urls = menubotUrls(key)
  const merge = (patch) => {
    state.data.value = { ...(state.data.value ?? {}), ...patch }
    state.source.value = 'live'
    state.updatedAt.value = new Date().toISOString()
  }

  const jobs = [
    captureScript(urls.dishes).then((html) => {
      const parsed = splitDishes(parseStandardMenu(toRoot(html)))
      if (parsed.food.length) merge(parsed)
    }),
    captureScript(urls.beer).then((html) => {
      const beer = parseStandardMenu(toRoot(html))
      if (beer.length) merge({ beer })
    }),
    captureScript(urls.daily).then((html) => {
      const daily = parseDailyMenu(toRoot(html))
      if (daily.day || daily.categories.length) merge({ daily: { ...daily, live: true } })
    }),
  ]
  Promise.allSettled(jobs).then(() => (state.loading.value = false))

  return state
}
