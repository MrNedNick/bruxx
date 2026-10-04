// GitHub Pages serves static files only. Every route gets its own copy of
// index.html (so deep links answer 200 and carry the right <html lang> and
// <title>), and 404.html boots the app for anything else.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { LOCALES, PAGES, pathFor, messages } from '../src/i18n.js'

const dist = new URL('../dist/', import.meta.url)
const html = await readFile(new URL('index.html', dist), 'utf8')

const titleFor = (page, lang) => {
  const c = messages[lang]
  return page === 'home' ? `Bruxx — ${c.meta.tagline}` : `${c.nav[page] ?? c[page]?.title} · Bruxx`
}

let n = 0
for (const { code } of LOCALES) {
  for (const page of Object.keys(PAGES)) {
    const path = pathFor(page, code)
    const out = html
      .replace('<html lang="cs">', `<html lang="${code}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${titleFor(page, code)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${messages[code].meta.description}`)
    const dir = new URL(`.${path === '/' ? '' : path}/`, dist)
    await mkdir(dir, { recursive: true })
    await writeFile(new URL('index.html', dir), out)
    n++
  }
}
await writeFile(new URL('404.html', dist), html)
console.log(`postbuild: ${n} route pages + 404.html`)
