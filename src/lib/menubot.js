// Parser for the menu exports the restaurant maintains in Menubot.
// The exports are scripts that document.write() an HTML fragment; this module
// turns that fragment into plain data. It only needs a DOM root, so the same
// code runs in the browser (DOMParser) and in Node (linkedom) for the snapshot.

export const MENUBOT_BASE =
  'https://www.menubot.cz/app/users/bruxx8462641256985656587/export'

// Menubot language suffixes: _a is Czech, _b is English.
export const MENUBOT_LANG = { cs: 'a', en: 'b' }

export const menubotUrls = (lang) => {
  const s = MENUBOT_LANG[lang] ?? MENUBOT_LANG.en
  return {
    dishes: `${MENUBOT_BASE}/standardmenu2_${s}.js`,
    beer: `${MENUBOT_BASE}/standardmenu1_${s}.js`,
    daily: `${MENUBOT_BASE}/dailymenu_${s}.js`,
  }
}

const NBSP = / /g
const clean = (s = '') => s.replace(NBSP, ' ').replace(/\s+/g, ' ').trim()

const PRICE = /^(\d[\d ]*),–$/
const ABV = /^(\d+(?:,\d+)?)\s?%$/
const ALLERGENS = /^(?:1[0-4]|[1-9])(?:\s?,\s?(?:1[0-4]|[1-9]))*$/

/**
 * Splits Menubot's "quantity line" — e.g. `5 %   0,33 l   75,–   0,5 l   109,–`
 * or `800 g   430,–   1, 7, 9, 10, 14` — into its parts. Fields are separated
 * by runs of (non-breaking) spaces; a size is whatever stands before a price.
 */
export function parseQuantity(raw = '') {
  const tokens = raw
    .replace(NBSP, ' ')
    .split(/\s{2,}|\s(?=\d+,–)/)
    .map((t) => t.trim())
    .filter(Boolean)

  const out = { abv: null, variants: [], allergens: [], isNew: false }
  let pendingSize = null
  for (const t of tokens) {
    let m
    if ((m = t.match(PRICE))) {
      out.variants.push({ size: pendingSize, price: Number(m[1].replace(/ /g, '')) })
      pendingSize = null
    } else if (!out.abv && !out.variants.length && (m = t.match(ABV))) {
      out.abv = Number(m[1].replace(',', '.'))
    } else if (out.variants.length && ALLERGENS.test(t)) {
      out.allergens = t.split(',').map((n) => Number(n.trim()))
    } else if (/^new$/i.test(t)) {
      out.isNew = true
    } else {
      pendingSize = pendingSize ? `${pendingSize} ${t}` : t
    }
  }
  return out
}

/** `<h3>moules Bruxx<br>slávky Bruxx</h3>` → `{ name, sub }` */
function readTitle(h3) {
  if (!h3) return { name: '', sub: '' }
  const parts = h3.innerHTML
    .replace(/<img[^>]*>/gi, '')
    .replace(/<span[\s\S]*?<\/span>/gi, '')
    .split(/<br\s*\/?>/i)
    .map((p) => clean(decode(p.replace(/<[^>]+>/g, ''))))
    .filter(Boolean)
  return { name: parts[0] ?? '', sub: parts.slice(1).join(' · ') }
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'", apos: "'", nbsp: ' ' }
function decode(s) {
  return s.replace(/&(#?\w+);/g, (m, e) =>
    e in ENTITIES ? ENTITIES[e] : e.startsWith('#') ? String.fromCharCode(Number(e.slice(1))) : m,
  )
}

function readItem(el) {
  const h3 = el.querySelector('h3')
  const { name, sub } = readTitle(h3)
  const q = parseQuantity(el.querySelector('.mnoz')?.textContent ?? '')
  const isNew = q.isNew || !!h3?.querySelector('img')
  const desc = clean(el.querySelector('p')?.textContent ?? '')
  return { name, sub, desc, ...q, isNew }
}

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Reads a standard (permanent) menu fragment: a flat run of category headers
 * (`.dm-cat-header h2`) each followed by `.dm-item`s. Items without a name
 * become the category's note; a header with no title continues the previous
 * category, which is how Menubot splits one long list.
 */
export function parseStandardMenu(root) {
  const categories = []
  let current = null
  for (const el of root.querySelectorAll('.dm-cat-header, .dm-item')) {
    if (el.classList.contains('dm-cat-header')) {
      const h2 = el.querySelector('h2')
      const title = clean(h2?.textContent ?? '')
      if (!title && current) continue
      current = { id: h2?.id ? slug(h2.id) : slug(title), title, note: '', items: [] }
      categories.push(current)
      continue
    }
    if (!current) continue
    const item = readItem(el)
    if (!item.name && item.desc && !item.variants.length) {
      current.note = current.note ? `${current.note} ${item.desc}` : item.desc
    } else if (item.name || item.desc) {
      current.items.push(item)
    }
  }
  return categories.filter((c) => c.items.length || c.note)
}

/**
 * Reads the daily lunch menu: a heading with the day, `.dm-cat` blocks that
 * may or may not carry a category title, a closing note and the e-mail
 * subscription form whose hidden fields we keep so our own form can post to it.
 */
export function parseDailyMenu(root) {
  const day = clean(root.querySelector('h1')?.textContent ?? '')
  const categories = []
  for (const cat of root.querySelectorAll('.dm-cat')) {
    const title = clean(cat.querySelector('h2')?.textContent ?? '')
    if (title || !categories.length) categories.push({ title, items: [] })
    const target = categories[categories.length - 1]
    for (const it of cat.querySelectorAll('.dm-item')) {
      const item = readItem(it)
      if (item.name) target.items.push(item)
    }
  }

  let note = ''
  for (const p of root.querySelectorAll('p')) {
    if (p.closest('.dm-cat') || p.closest('#popupgdpr') || p.closest('#mbcontent')) continue
    const t = clean(p.textContent)
    if (t) note = note ? `${note} ${t}` : t
  }

  const form = root.querySelector('form#menubotsub')
  const subscribe = form
    ? {
        action: form.getAttribute('action'),
        fields: Object.fromEntries(
          [...form.querySelectorAll('input[type="hidden"]')]
            .filter((i) => i.getAttribute('name'))
            .map((i) => [i.getAttribute('name'), i.getAttribute('value') ?? '']),
        ),
      }
    : null

  return { day, categories: categories.filter((c) => c.items.length), note, subscribe }
}

// Category ids where the drinks and the wine list begin in the dishes export.
const DRINKS_START = ['nealkoholickenapoje', 'non-alcoholicdrinks']
const WINE_START = ['rozlevanavina', 'winesbytheglass']

/** Splits the dishes export into food, drinks and wine sections. */
export function splitDishes(categories) {
  const find = (ids) =>
    categories.findIndex((c) => ids.some((id) => c.id.replace(/-/g, '') === id.replace(/-/g, '')))
  const d = find(DRINKS_START)
  const w = find(WINE_START)
  if (d < 0 || w < 0 || w < d) return { food: categories, drinks: [], wine: [] }
  return { food: categories.slice(0, d), drinks: categories.slice(d, w), wine: categories.slice(w) }
}

/** Runs a Menubot export script against a fake `document` and returns what it wrote. */
export function captureWrites(source) {
  let out = ''
  const document = {
    write: (...a) => (out += a.join('')),
    writeln: (...a) => (out += a.join('') + '\n'),
    getElementById: () => null,
    body: { insertAdjacentHTML() {} },
  }
  const window = { location: { href: '', search: '' } }
  try {
    new Function('document', 'window', 'URLSearchParams', source)(document, window, URLSearchParams)
  } catch {
    // The exports end with page-specific helpers that expect a real browser;
    // everything we need has already been written by then.
  }
  return out
}
