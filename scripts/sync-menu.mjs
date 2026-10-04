// Downloads the restaurant's Menubot exports and stores them as JSON in
// src/data/, so the site renders a full menu instantly and still has one if
// Menubot is unreachable. The browser refreshes it live on top of that.
//
//   npm run menu:sync
//
// Exits non-zero (and leaves the existing files alone) if an export cannot be
// read, so a deploy never replaces a good snapshot with an empty one.

import { writeFile, mkdir } from 'node:fs/promises'
import { parseHTML } from 'linkedom'
import {
  captureWrites,
  menubotUrls,
  parseDailyMenu,
  parseStandardMenu,
  splitDishes,
} from '../src/lib/menubot.js'

const OUT = new URL('../src/data/', import.meta.url)

async function load(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (menu snapshot)' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  const html = captureWrites(await res.text())
  if (!html) throw new Error(`${url}: export wrote nothing`)
  return parseHTML(`<!doctype html><html><body>${html}</body></html>`).document.body
}

const count = (cats) => cats.reduce((n, c) => n + c.items.length, 0)

async function snapshot(lang) {
  const urls = menubotUrls(lang)
  const [dishes, beer, daily] = await Promise.all([load(urls.dishes), load(urls.beer), load(urls.daily)])
  const { food, drinks, wine } = splitDishes(parseStandardMenu(dishes))
  const data = {
    syncedAt: new Date().toISOString(),
    food,
    drinks,
    wine,
    beer: parseStandardMenu(beer),
    daily: parseDailyMenu(daily),
  }
  for (const key of ['food', 'drinks', 'wine', 'beer']) {
    if (count(data[key]) < 5) throw new Error(`${lang}.${key}: only ${count(data[key])} items`)
  }
  return data
}

try {
  const results = await Promise.all(['cs', 'en'].map(async (lang) => [lang, await snapshot(lang)]))
  await mkdir(OUT, { recursive: true })
  for (const [lang, data] of results) {
    await writeFile(new URL(`menu-${lang}.json`, OUT), JSON.stringify(data) + '\n')
    const n = ['food', 'drinks', 'wine', 'beer'].map((k) => `${k} ${count(data[k])}`).join(', ')
    console.log(`menu-${lang}.json: ${n}; lunch "${data.daily.day}" ${count(data.daily.categories)}`)
  }
} catch (err) {
  console.error(`menu sync failed, keeping the existing snapshot: ${err.message}`)
  process.exit(1)
}
