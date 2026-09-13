# Frontend baseline before React Router framework mode

Audited 2026-09-13 on `migrate-react-router` at `6189df9`, using committed `data/data.json` and the live GitHub Pages site.

## Data and build

- The Supabase exporter writes published records only, restores Ukrainian vocabulary labels, and omits the database's stored slug. The frontend derives slugs from mutable names: lowercase, retain Unicode letters/digits, collapse other runs to `-`, then trim `-`.
- 267 entries: 187 tools, 45 companies, 35 platforms; 0 empty slugs and 0 duplicate slugs.
- All 267 records have `deep_research.long_description` (706,484 characters total). It is bundled but not rendered by the current detail page.
- `data.json` is 2,496,145 bytes. The current same-data build took 0.97 s on Node 24.13.0/npm 11.6.2 and emitted 2,593,639-byte JS (Vite: 682.30 kB gzip), 10,736-byte CSS, and 812-byte HTML. Raw HTML is an empty `#root` with no catalog content or entry links; there are no frontend tests.
- Pages runs Node 22 and `npm ci`; `package-lock.json` is authoritative even though a pnpm lockfile is also committed.

## Current route and response matrix

`/tool/:slug` serves every entry type. `/en` is a runtime router basename. The deployment copies `index.html` to `404.html`.

| URL | Client behavior | Direct live HTTP response |
| --- | --- | --- |
| `/` | Ukrainian tool listing | `200`, blank app shell |
| `/?type=company` or `?type=platform` | Other type after JS | `200`, blank app shell |
| `/en` or `/en/` | English chrome; Ukrainian content | `404`, copied app shell |
| `/tool/:slug` | Detail for any type | `404`, copied app shell |
| `/en/tool/:slug` | English-chrome detail | `404`, copied app shell |
| `/tool/:missing` | Client “not found” | `404`, copied app shell |
| Any other path | Shared chrome, no body match | `404`, copied app shell |

## Behavior contract

| Area | Existing behavior to preserve |
| --- | --- |
| Type/search | Tool is default; buttons write/delete `type`. Case-insensitive `q` searches name, tagline, description, and target users. |
| Facets | Repeated `sector`, `status`, `origin` values are OR within a group and AND across groups; counts ignore their own group. |
| URL/history | Updates replace history and retain unknown params. Clear retains non-default `type` and `showAll=true`. |
| Cards/order | `showAll=true` exposes status/maturity/access. Sort is rating descending then Ukrainian name. |
| Detail/back | Both card links carry the whole query. Explicit back returns to `/` with it; browser Back returns to the prior client location. |
| Language | `/en` translates UI/vocabulary only. Full-load switching preserves path/query/hash; entry text stays Ukrainian. |
| Mobile | Facets initialize open above 760 px and closed below it; prerender must use deterministic initial markup. |

## Verification set

Check `/tool/acrontis`, `/tool/a-gnostics`, `/tool/abm-rinkai-tms`, mixed Unicode `/tool/ai-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%81%D1%82`, and every equivalent `/en` path. Also cover the longest Cyrillic slug (`АСУР 2.0…`), a filtered URL such as `/?type=company&q=AI&sector=%D0%9E%D1%81%D0%B2%D1%96%D1%82%D0%B0&showAll=true`, missing entry/route, encoded paths, trailing slashes, and client `.data` requests. For all 267 slugs in both languages, assert one generated route, successful direct HTTP, raw HTML with name/description/research/metadata and real anchors, plus correct hydration. Unknown paths must remain genuine 404s. Test filter hydration, language switching, explicit back, and browser Back.

## Dependency and structure recommendation

- Pin `react-router@7.18.3`, `@react-router/node@7.18.3`, and dev dependency `@react-router/dev@7.18.3`; retain React/React DOM 18.3.1 and Vite 5.4.21. RR 7 supports React 18+, Node 20+, and Vite 5.1–8.
- Do not take RR 8.3.1: it requires React 19.2.7+, Node 22.22+, and Vite 7/8, adding unrelated upgrade scope.
- Use the framework plugin and `react-router dev/build`; replace `react-router-dom` imports and `@vitejs/plugin-react`. Keep npm as the single package manager.
- Keep `src/root.jsx`, explicit `src/routes.js`, one browse module, and one detail module. Set `appDirectory: "src"`, `ssr: false`, and generate prerender paths from JSON.
- Generate six browse paths (`/`, `/company`, `/platform`, plus `/en` mirrors) and 534 detail paths: 540 total. Keep legacy `/?type=company|platform` URLs working; do not prerender query combinations.
- Official docs confirm dynamic values need explicit paths, loaders run at build time, and each path emits HTML plus `.data`: [migration](https://reactrouter.com/upgrading/router-provider), [routing](https://reactrouter.com/start/framework/routing), [prerendering](https://reactrouter.com/how-to/pre-rendering). npm metadata checked 2026-09-13.

## Risks

- Name-derived URLs can silently change on rename; centralize today's slug algorithm. Exporting stored slugs/redirects is separate data work.
- Render-time `window` reads in language and mobile facet code will break or mismatch prerendering.
- Shared JSON imports can leak all long research into listing assets; browse loaders need listing fields, detail loaders one full record.
- Pages must publish nested HTML and `.data` output and stop using the copied SPA fallback. Explicit `/en` route branches replace runtime basename detection.

No product question blocks Stage 2.
