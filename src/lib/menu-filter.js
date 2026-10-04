// Search and allergen filtering for the menu page, kept free of Vue so it can be tested.

const fold = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/**
 * Keeps the items that match every word of `query` (accent- and case-insensitive,
 * across name, translation and description) and contain none of the `excluded`
 * allergens. Categories left empty disappear; a category whose title matches
 * keeps all its items.
 */
export function filterCategories(categories, { query = '', excluded = [] } = {}) {
  const words = fold(query).split(/\s+/).filter(Boolean)
  const blocked = new Set(excluded)

  return categories
    .map((cat) => {
      const titleHit = words.length > 0 && words.every((w) => fold(cat.title).includes(w))
      const items = cat.items.filter((item) => {
        if (item.allergens?.some((a) => blocked.has(a))) return false
        if (!words.length || titleHit) return true
        const hay = fold(`${item.name} ${item.sub} ${item.desc}`)
        return words.every((w) => hay.includes(w))
      })
      return { ...cat, items }
    })
    .filter((cat) => cat.items.length)
}

/** Strength bucket used by the beer finder: light up to 5 %, mid 5–8 %, strong over 8 %. */
export function beerStrength(abv) {
  if (abv == null) return null
  if (abv <= 5) return 'light'
  if (abv <= 8) return 'mid'
  return 'strong'
}
