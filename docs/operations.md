# Development, publication and verification

## Local setup

Node.js 20 or later, npm, and a clean installation:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

Development runs at `http://localhost:5173/`. The production preview is normally
`http://127.0.0.1:4173/bruxx/`. Test the production build as well as development:
it exercises the `/bruxx/` base path and generated route files.

`BASE_PATH=/ npm run build` prepares assets for a domain root. It does not
change canonical URLs or remove the preview’s `noindex` setting.

## Publication

`.github/workflows/deploy.yml` runs on pushes to `main`, manual dispatch and a
daily schedule at **04:30 UTC**. The schedule is UTC, not fixed Prague local time.

It installs locked dependencies, attempts to refresh menu snapshots, runs tests,
builds all route pages and uploads the Pages artifact. Deployment uses GitHub’s
Pages environment and OIDC. A menu refresh failure preserves the bundled
snapshots; a test or build failure stops deployment.

```sh
gh run list --workflow deploy.yml
gh run watch <run-id>
gh api repos/MrNedNick/bruxx/pages
```

If `gh run watch` reports no active runs, the run may already be complete. Use
`gh run list` before assuming publication failed. Repository Pages settings must
use **GitHub Actions**. The public preview is
<https://mrnednick.github.io/bruxx/>.

For rollback, revert the faulty commit with a new commit and push `main`. Avoid
rewriting published history. A manual workflow dispatch also refreshes the menu
without a source change.

## Verification checklist

Use a fresh build at desktop and **360 px**, in light and dark themes.

- Home: primary booking and menu actions, quick lunch/beer/directions links;
  original restaurant story, photos, facts and contacts remain present.
- Menu: search without Czech accents; no-results recovery; excluded allergens;
  food/drinks/wine/beer/lunch tabs and keyboard arrows; switching away from food
  does not secretly apply its allergen exclusions to drinks.
- Freshness: inspect all three source states. Simulate a failed export in the
  unit tests; it must retain saved data and must not inherit another part’s
  live label.
- Beer: direct finder link, style and strength filters, sorting, result count.
- Booking: open from the header and from `#rezervace` after a reload; close with
  the button and Escape; verify phone and separate-window fallback. Stop before
  sending a real reservation.
- Subscription: consent initially unchecked, privacy link, validation, timeout
  and confirmed/unconfirmed feedback. Do not submit a real address in routine QA.
- Locale: Czech, English and German; translated route remains on the same page.
- Contact/family: correct contacts and hours; map loads only after clicking;
  original children’s menu link is available.
- Gallery: filters, photo dialog, next/previous and Escape. Recipes: portion
  controls recalculate and remain understandable.
- Reload a deep link under `/bruxx/`; check assets, console errors and failed
  resource responses. Check the deployed URL after Pages completes.

`npm test` covers content structure/facts, menu parsing/filtering, Prague hours,
recipe scaling, partial live-menu failures and races, early reservation opening,
newsletter timeout/consent and the visible per-section freshness message.
Manual browser checks are still needed for layout, external provider behavior
and focus/keyboard interaction.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Cached menu notice | Original restaurant menu, provider availability, scheduled build; run `npm run menu:sync` |
| Blank booking frame | Separate-window fallback, browser blockers, Bookio availability |
| Unknown subscription result | Do not label it successful; inspect the provider redirect and approved test inbox |
| Deep link or assets fail | Rebuild with the correct base; confirm `scripts/postbuild.mjs` generated the route directory |
| Preview differs from local | Verify the latest deployed commit and hard reload; compare against a fresh production build |
| Test says translations differ | Keep all three content objects structurally aligned |
