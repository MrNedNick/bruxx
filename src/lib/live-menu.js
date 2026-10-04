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

/** Merge independent live exports without calling a cached section live. */
export function createMenuState(loadSnapshot, loaders) {
  const state = {
    data: shallowRef(null),
    parts: ref({}),
    loading: ref(true),
    updatedAt: ref(null),
  }
  const snapshotJob = loadSnapshot().then((m) => {
    const snap = m.default ?? m
    state.data.value = { ...snap, ...(state.data.value ?? {}) }
    state.updatedAt.value = snap.syncedAt
  })
  const jobs = Object.entries(loaders).map(async ([part, load]) => {
    try {
      const patch = await load()
      if (!patch) throw new Error('Empty menu export')
      state.data.value = { ...(state.data.value ?? {}), ...patch }
      state.parts.value = { ...state.parts.value, [part]: 'live' }
    } catch {
      state.parts.value = { ...state.parts.value, [part]: 'snapshot' }
    }
  })
  state.ready = Promise.allSettled([snapshotJob, ...jobs]).then(() => {
    state.loading.value = false
  })
  return state
}

export function useMenu(lang) {
  const key = menuLang(lang)
  if (cache[key]) return cache[key]
  const urls = menubotUrls(key)
  cache[key] = createMenuState(snapshots[key], {
    dishes: async () => {
      const parsed = splitDishes(parseStandardMenu(toRoot(await captureScript(urls.dishes))))
      return ['food', 'drinks', 'wine'].every((part) => parsed[part].length) ? parsed : null
    },
    beer: async () => {
      const beer = parseStandardMenu(toRoot(await captureScript(urls.beer)))
      return beer.length ? { beer } : null
    },
    daily: async () => {
      const daily = parseDailyMenu(toRoot(await captureScript(urls.daily)))
      return daily.day || daily.categories.length ? { daily: { ...daily, live: true } } : null
    },
  })
  return cache[key]
}
