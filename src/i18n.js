import { computed, ref } from 'vue'
import cs from './content/cs.js'
import en from './content/en.js'
import de from './content/de.js'

export const LOCALES = [
  { code: 'cs', label: 'Čeština', short: 'CZ', intl: 'cs-CZ' },
  { code: 'en', label: 'English', short: 'EN', intl: 'en-GB' },
  { code: 'de', label: 'Deutsch', short: 'DE', intl: 'de-DE' },
]

const messages = { cs, en, de }

// Each page has its own slug per language; Czech lives at the root.
export const PAGES = {
  home: { cs: '', en: '', de: '' },
  menu: { cs: 'menu', en: 'menu', de: 'speisekarte' },
  beer: { cs: 'piva', en: 'beer', de: 'bier' },
  about: { cs: 'o-nas', en: 'about', de: 'ueber-uns' },
  gallery: { cs: 'galerie', en: 'gallery', de: 'galerie' },
  kids: { cs: 'pro-deti', en: 'kids', de: 'kinder' },
  recipes: { cs: 'recepty', en: 'recipes', de: 'rezepte' },
  contact: { cs: 'kontakt', en: 'contact', de: 'kontakt' },
  privacy: { cs: 'ochrana-osobnich-udaju', en: 'privacy', de: 'datenschutz' },
}

export const locale = ref('cs')

export function pathFor(page, lang = locale.value) {
  const slug = PAGES[page]?.[lang] ?? ''
  const prefix = lang === 'cs' ? '' : `/${lang}`
  return `${prefix}/${slug}`.replace(/\/+$/, '') || '/'
}

export const content = computed(() => messages[locale.value] ?? cs)

export function useContent() {
  return { c: content, locale, pathFor, intl: computed(() => LOCALES.find((l) => l.code === locale.value).intl) }
}

/** `fmt('Otevřeno do {t}', { t: '23:00' })` */
export const fmt = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

export { messages }
