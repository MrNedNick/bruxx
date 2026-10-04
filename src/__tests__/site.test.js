import { describe, expect, it } from 'vitest'
import cs from '../content/cs.js'
import en from '../content/en.js'
import de from '../content/de.js'
import { PAGES, pathFor } from '../i18n'
import { openStatus } from '../lib/hours'
import { beerStrength, filterCategories } from '../lib/menu-filter'
import { formatQty, scaleQty } from '../lib/recipes'
import snapshotCs from '../data/menu-cs.json'
import snapshotEn from '../data/menu-en.json'

// The shape of an object: keys and array lengths, not the words.
function shape(v) {
  if (Array.isArray(v)) return v.map(shape)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])]))
  return typeof v
}

describe('content', () => {
  it('has the same structure in all three languages', () => {
    expect(shape(en)).toEqual(shape(cs))
    expect(shape(de)).toEqual(shape(cs))
  })

  it('keeps the restaurant’s facts', () => {
    const all = JSON.stringify(cs)
    expect(all).toContain('Eastern Scheldt')
    expect(all).toContain('Husa Catering s.r.o.')
    expect(all).toContain('24717576')
    expect(cs.home.stats.map((s) => s.value)).toEqual([60, 8, 3, 45])
  })

  it('names all 14 allergens in every language', () => {
    for (const c of [cs, en, de]) expect(Object.keys(c.allergens)).toHaveLength(14)
  })
})

describe('routes', () => {
  it('gives every page a distinct path per language', () => {
    for (const lang of ['cs', 'en', 'de']) {
      const paths = Object.keys(PAGES).map((p) => pathFor(p, lang))
      expect(new Set(paths).size).toBe(paths.length)
    }
    expect(pathFor('home', 'cs')).toBe('/')
    expect(pathFor('beer', 'cs')).toBe('/piva')
    expect(pathFor('beer', 'en')).toBe('/en/beer')
    expect(pathFor('menu', 'de')).toBe('/de/speisekarte')
  })
})

describe('openStatus (Prague time)', () => {
  // October 2026 is CEST, UTC+2.
  it('is open on a Monday afternoon until 23:00', () => {
    expect(openStatus(new Date('2026-10-05T12:00:00Z'))).toMatchObject({ open: true, until: '23:00' })
  })

  it('stays open until midnight on Friday', () => {
    expect(openStatus(new Date('2026-10-09T21:30:00Z'))).toMatchObject({ open: true, until: '0:00' })
  })

  it('opens at 11:30 later the same morning', () => {
    expect(openStatus(new Date('2026-10-05T07:00:00Z'))).toMatchObject({ open: false, today: true, opensAt: '11:30' })
  })

  it('after closing, points to tomorrow', () => {
    expect(openStatus(new Date('2026-10-05T21:15:00Z'))).toMatchObject({ open: false, today: false, opensDay: 2 })
  })
})

describe('menu filter', () => {
  const cats = [
    {
      id: 'musle',
      title: 'mušle',
      items: [
        { name: 'moules Bruxx', sub: 'slávky Bruxx', desc: 'česnek, slanina', allergens: [1, 7, 14] },
        { name: 'moules au vin blanc', sub: 'slávky na bílém víně', desc: 'šalotka', allergens: [7, 14] },
      ],
    },
    { id: 'dezerty', title: 'dezerty', items: [{ name: 'gaufre de liège', sub: 'lutyšská vafle', desc: '', allergens: [1, 3, 7] }] },
  ]

  it('matches without accents and across fields', () => {
    expect(filterCategories(cats, { query: 'vafle' }).flatMap((c) => c.items.map((i) => i.name))).toEqual(['gaufre de liège'])
    expect(filterCategories(cats, { query: 'bilem' })[0].items).toHaveLength(1)
  })

  it('hides dishes with an excluded allergen and drops empty categories', () => {
    const out = filterCategories(cats, { excluded: [14] })
    expect(out.map((c) => c.id)).toEqual(['dezerty'])
  })

  it('buckets beer strength', () => {
    expect([beerStrength(3.6), beerStrength(6.5), beerStrength(9), beerStrength(null)]).toEqual(['light', 'mid', 'strong', null])
  })
})

describe('recipes', () => {
  it('scales quantities and rounds them like a cook', () => {
    expect(scaleQty(500, 1.5, 'g')).toBe(750)
    expect(scaleQty(1.2, 0.5, 'l')).toBe(0.6)
    expect(scaleQty(3, 0.5, '')).toBe(1.5)
    expect(formatQty(1.5, 'cs-CZ')).toBe('1½')
    expect(formatQty(0.6, 'cs-CZ')).toBe('0,6')
  })
})

describe('menu snapshot', () => {
  it('has every section in both languages', () => {
    for (const snap of [snapshotCs, snapshotEn]) {
      for (const key of ['food', 'drinks', 'wine', 'beer']) {
        expect(snap[key].reduce((n, c) => n + c.items.length, 0)).toBeGreaterThan(5)
      }
      expect(snap.daily).toHaveProperty('categories')
    }
  })
})
