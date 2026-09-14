# Frontend migration: React Router framework mode

Approved direction · 2026-09-13 · Implementation scope: this `web` repository.
Read the repository instructions and `../ai-workflows/product/VISION.md` first.

## Goal

Make every published catalog entry discoverable and readable in the initial HTML,
with working direct URLs, while preserving interactive browsing. Keep the frontend
easy to extend with new pages, filters, curated guides, and eventually models.

## Approach

Use **React Router framework mode with prerendering and `ssr: false`**. Generate
HTML and client-navigation data from committed `data/data.json` at build time.
React hydrates those pages and handles navigation and interactions in the browser.

Keep GitHub Pages and the existing Supabase → JSON → git → build publishing flow.
Reuse the current design and React components. React familiarity and shared routing,
layouts, and data-loading conventions make this the preferred option for growth.
No runtime server or database migration is needed for this release.

Canonical entry URLs use Latin transliteration of Ukrainian names. Keep existing
Latin slugs unchanged and retain old Cyrillic paths as compatibility aliases;
catalog links and sitemap entries use the canonical Latin paths.

## Stages

### 1. Establish the baseline — complete

Reviewed 2026-09-13: [baseline and verification cases](docs/frontend-baseline.md).
267 entries, all researched; no slug collisions. The baseline records existing
behavior and representative URLs. Final dependency and URL choices are recorded below.

- Inspect the current checkout and deployment; preserve unrelated local changes.
- Inventory entry URLs, slugs, language switching, filters, and back navigation.
- Check empty/duplicate slugs and record representative routes for verification.

### 2. Adopt framework mode and prerender — complete

Reviewed 2026-09-14: React Router 7.18.3, React 19.3.0, Vite 8.3.0; npm only.
564 routes: six browse pages, 534 canonical detail pages, 24 legacy aliases.
Build and six slug tests pass. Strict static-host browser checks pass for direct
URLs, filters, history, language, alias replacement, and mobile facet controls.
Shared JavaScript is 365,900 bytes versus 2,593,639 before migration.

- Select compatible dependencies; migrate to route modules, shared layouts, and loaders.
- Enumerate entry and browse routes from JSON and prerender them during the build.
- Use transliterated Latin slugs, preserve old Cyrillic URLs as aliases, and retain
  `/` / `/en` routing. Fail the build on empty or conflicting slugs.
- Provide linked browse pages covering all entry types; discovery must not require
  operating JavaScript tabs or filters.

### 3. Adapt components and data — 5–8 h

- Preserve search, facets, counts, tabs, query parameters, and back navigation.
- Remove render-time dependence on browser globals, especially in `i18n.jsx`;
  ensure the initial HTML and hydration agree on language and mobile facet state.
- Return only listing/search fields from listing loaders. Keep full records out of
  shared browser imports; render `deep_research.long_description` and sources on
  the relevant detail pages.

### 4. Add search essentials — 6–9 h

- Generate individual titles, descriptions, canonical URLs, and a sitemap.
- Include real anchor links in HTML; keep arbitrary filter combinations out of
  the sitemap and define their canonical handling.
- Preserve English UI support without treating Ukrainian entry text as translated.
  Canonicalize English UI copies and legacy aliases to the Ukrainian canonical
  page; list only canonical, unfiltered URLs in the sitemap. Add translation
  annotations when the main content is actually translated.

### 5. Verify and release — 6–10 h

- Update the Pages workflow to publish generated assets and navigation data;
  replace the copied SPA fallback with a genuine missing-page response.
- Preserve the custom domain and publishing notifications.
- Verify on static hosting without an SPA rewrite, then check production after release.
  Any cloud configuration changes must be applied by the owner; cloud CLI is read-only.

## Done when

- With JavaScript disabled, every published entry is reachable and readable,
  including available research; page metadata and links are present in raw HTML.
- Valid direct URLs return 200; unknown URLs return 404. Client navigation also works.
- Filters, shared URLs, language switching, back navigation, and mobile layout work
  without hydration errors. Listing assets do not contain all entries’ full research.
- A data update rebuilds the pages and sitemap. Add focused route/content and
  interaction checks; verify actual HTTP responses, not just the development server.

## Estimate and follow-up

**Core: 35–55 h**, including 25% contingency; roughly 5–7 eight-hour workdays.
Reassess after the baseline stage. Excludes redesign, full translation, model
ingestion, and Google indexing time.

**Later: first 1–2 curated guides, +8–14 h.** Use a shared React template with
reviewed selections, introductions, metadata, and prerendered URLs. Add use-case
tags when needed; reuse the pattern for models once their data exists. Current
ratings measure significance, not task performance; ranked claims need appropriate
evidence and a clear definition of “Ukrainian.” Do not build this follow-up in the
core migration.
