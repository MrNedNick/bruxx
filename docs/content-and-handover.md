# Content and handover

Bruxx is a restaurant website redesign. Its purpose is to help a guest choose
food, explore Belgian beer, book a table and find the restaurant while retaining
the restaurant’s identity and existing services.

The [preview](https://mrnednick.github.io/bruxx/) is separate from the
[restaurant’s current website](https://www.bruxx.cz/). It carries `noindex`;
publishing the preview does not replace the restaurant’s domain.

## Content map

Source pages were reviewed on **4 October 2026**. Restaurant information may
change; the source links below remain the editorial reference.

| Original | In this site | Handling |
| --- | --- | --- |
| [Home](https://www.bruxx.cz/) | Home, lunch panel, shared footer | Address, phone, opening hours, Together links; lunch loaded from the same Menubot source |
| [About](https://www.bruxx.cz/o-nas/) | About, team, home story | Restaurant identity, people and photographs retained |
| [Bruxx exclusive](https://www.bruxx.cz/bruxx-exclusive/) | Home cornerstones and About | Mussels from Yerseke, fries, fish, waffles and Belgian beer stories |
| [Menu](https://www.bruxx.cz/menu/) | Menu: lunch, food, drinks, wine, beer | Names, descriptions, portions, prices and allergens parsed from Menubot, not rewritten |
| [Beer](https://www.bruxx.cz/piva/) | Beer stories and finder | Editorial recommendations retained; finder uses Menubot beer prices |
| [Gallery](https://www.bruxx.cz/galerie/) | Gallery | Existing restaurant photography, video and virtual tour |
| [For children](https://www.bruxx.cz/pro-deti/) | For children | Weekend schedule and photos; explicit link to the original children’s menu and prices |
| [Recipes](https://www.bruxx.cz/recepty-oldy-matouska/) | Recipes | Recipe content with portion scaling |
| [Events](https://www.bruxx.cz/akce/) | Home seasonal section | Illustrative seasonal themes; direct link to current events, no invented dates |
| [Contacts](https://www.bruxx.cz/kontakty/) | Contact and footer | Address, hours, operator, map, phone and public restaurant contact |
| [Together card](https://www.tgthr.cz/kupkartu/) | Footer | Existing external destination |
| [Privacy](https://www.bruxx.cz/podminky-ochrany-osobnich-udaju/) | Privacy | Restaurant source text; review against final integrations before domain launch |

This is an editorial redesign, not a word-for-word mirror. Short introductions
are adapted for the layout; full stories remain in their relevant pages. The
English copy follows the English restaurant content; German is an additional
translation. German visitors see the English live menu, with an explicit note.

## Where to make changes

| Change | File / source |
| --- | --- |
| Page text and labels | `src/content/cs.js`, `en.js`, `de.js` — keep the same key structure |
| Address, public contacts, booking and external links | `src/lib/reservation.js` |
| Regular opening hours | `src/lib/hours.js` — Prague timezone, shared by status and tables |
| Routes and translated slugs | `src/i18n.js` and `src/router/index.js` |
| Prices, portions, dish names, allergens | Restaurant’s Menubot, then `npm run menu:sync` |
| Photos | `src/assets/photos/`, `src/assets/photo-sizes.json`, `src/lib/photos.js` |
| Privacy text | `src/content/privacy.js` |
| Theme, typography and spacing | `src/style.css`; component styles for individual layouts |
| Static metadata and preview indexing | `index.html`, `scripts/postbuild.mjs` |

Do not hand-edit menu JSON to change a restaurant price: live data will replace
it. Do not translate or infer allergens. The filter only hides listed allergens;
questions about preparation or cross-contact must be discussed with staff.

## Menu behavior

1. A bundled snapshot renders without waiting for the external service.
2. Three independent exports refresh dishes/drinks/wine, beer and lunch.
3. Each export has its own freshness state. Fresh beer never makes a cached
   lunch menu appear live.
4. If an export fails or is empty, the saved section remains visible, with its
   snapshot date, an explanation and a link to the original restaurant menu.
5. Menu requests are shared within the page visit. Reload to request them again.

The date beside a saved menu is the **snapshot retrieval date**, not a claim
that lunch is served that day. Lunch keeps the day label supplied by Menubot;
the heading deliberately does not say “today”. The daily build refreshes the
snapshot without committing generated data back to the repository.

Menubot scripts execute in temporary same-origin frames to capture their HTML;
these frames are not a security sandbox. The integration trusts the restaurant’s
provider. A future first-party data endpoint would remove this dependency.

## Reservations and subscriptions

- Booking buttons and legacy reservation hashes open the restaurant’s Bookio
  widget. It loads on demand. Guests can also open it separately or call.
- Availability and confirmation belong to Bookio. This site does not store
  reservations or claim a booking before the provider confirms it.
- Lunch subscription uses Menubot’s current form fields. Consent starts unchecked
  and links to the privacy page. Only a recognized confirmation shows success.
  Unreadable responses and a 15-second timeout show an unconfirmed state and
  preserve the address so the guest can recover.
- Do not make real bookings or subscribe test addresses during routine QA.
  Use provider-approved test arrangements for a complete transaction test.
- Maps and videos load only when requested. Provider embeds may set their own
  cookies; final domain launch needs an integration/privacy review.

## Before replacing the current domain

Confirm restaurant approval of texts, translations, photographs and menu sources;
verify special opening hours and the lunch service start time (the existing copy
says 11:00 while regular opening hours start at 11:30). Test booking and newsletter
confirmation with the restaurant and provider. Plan old URL redirects, update
canonical/social metadata and remove `noindex` only for the approved domain.
The preview does not implement the original Shoptet account/cart workflows.
