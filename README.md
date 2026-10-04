# Bruxx — Belgian brasserie in Prague

A redesign of [bruxx.cz](https://www.bruxx.cz/), the website of a Belgian brasserie on
Náměstí Míru in Prague: fresh mussels three times a week, fries double-fried in
beef tallow, more than sixty Belgian beers and Liège waffles.

**[Open the site](https://mrnednick.github.io/bruxx/)**

![Bruxx](public/og.jpg)

## What it does

- **Live menu.** The restaurant keeps its menu in Menubot. The site renders a
  snapshot instantly and then swaps in the live data: today's lunch menu, the
  full food, drinks and wine list, and the beer list — in Czech and English.
- **Honest freshness.** Lunch, dishes and beer each show whether their own data
  is live or a saved snapshot, with a dated fallback and an original-site link.
- **Menu tools.** Sticky category bar that follows the scroll, accent-insensitive
  search, and an allergen filter that hides dishes containing any of the
  fourteen EU allergens.
- **Beer finder.** The beer list filtered by style and strength and sorted by
  strength or price, next to the general manager's own recommendations.
- **Booking.** The restaurant's Bookio widget, visible mobile booking action,
  separate-window and phone alternatives, and working `#rezervace` deep links.
- **Lunch menu by e-mail.** Subscribes through the same Menubot endpoint as the
  current site.
- **Three languages.** Czech, English and German, each page with its own URL
  (`/piva`, `/en/beer`, `/de/bier`).
- **Opening hours** with an "open now / opens at" status in Prague time.
- **Gallery** with filters, a keyboard and swipe lightbox, the restaurant's
  videos and its Street View tour.
- **Chef's recipes** with a servings stepper that rescales the ingredients.
- **Light and dark theme**, reduced-motion support, and layouts down to 360 px.

## Guest experience

The redesign keeps the restaurant’s photography, food stories and existing
booking/menu providers while making the most common tasks easier to reach:
choose lunch, find a beer, book a table or get directions. The home page adds
direct shortcuts, the menu offers recovery from an empty search, and family
and seasonal sections link back to the restaurant’s current information.

## Documentation

- [Content map and handover](docs/content-and-handover.md): original-site comparison, editing locations and integration behavior.
- [Operations](docs/operations.md): local setup, GitHub Pages, checks and troubleshooting.
- [Roadmap](docs/roadmap.md): delivered work, next improvements and domain-launch decisions.

## Stack

Vue 3, Vue Router, Vite. Self-hosted variable fonts (Archivo, Hanken Grotesk,
Fraunces). No UI framework and no first-party analytics; Google Maps and YouTube load only
when the visitor asks for them.

## How the live menu works

Menubot serves the menu as scripts that `document.write()` HTML and sends no
CORS headers, so it cannot be fetched. `src/lib/live-menu.js` runs each script
inside a blank iframe with `document.write` replaced, and
`src/lib/menubot.js` turns the captured HTML into data. The same parser runs in
Node (`npm run menu:sync`) to refresh the snapshot in `src/data/`; the deploy
workflow runs it every morning.

## Develop

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # parser, content, hours, filters, recipes
npm run menu:sync  # refresh the menu snapshot from Menubot
npm run build      # → dist/, base path /bruxx/
```

`BASE_PATH=/ npm run build` builds for a site served from the domain root.

## Deploy

A push to `main` runs the tests, builds and publishes to GitHub Pages
(`.github/workflows/deploy.yml`). The workflow also runs daily to refresh the
menu snapshot.

## Content

This is a separately published preview, not a replacement of the restaurant’s
production domain. Children’s prices and current events remain linked to their
authoritative pages. Provider forms require a real-world confirmation check
with the restaurant before a domain launch.


Texts, photos and the privacy policy are those of bruxx.cz and belong to the
restaurant; the German translation is new. The page carries `noindex` while
bruxx.cz is the live site.
