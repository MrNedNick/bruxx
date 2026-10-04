// Every photo exists as <name>-800.webp and <name>-1600.webp in assets/photos.
import sizes from '../assets/photo-sizes.json'

const files = import.meta.glob('../assets/photos/*.webp', { eager: true, import: 'default' })

const byName = {}
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/\/([^/]+)-(800|1600)\.webp$/)
  if (!m) continue
  ;(byName[m[1]] ??= {})[m[2]] = url
}

export function photo(name) {
  const p = byName[name]
  if (!p) throw new Error(`Unknown photo "${name}"`)
  const [width, height] = sizes[name] ?? []
  return {
    width,
    height,
    src: p['1600'] ?? p['800'],
    srcset: [p['800'] && `${p['800']} 800w`, p['1600'] && `${p['1600']} 1600w`].filter(Boolean).join(', '),
  }
}

