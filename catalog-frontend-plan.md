# Frontend migration: React Router framework mode

Approved 2026-09-13 · Scope: this `web` repository.
Read repository instructions and `../ai-workflows/product/VISION.md` first.

## Goal

Make every published entry discoverable and readable in the initial HTML, with
working direct URLs and interactive browsing. Keep the frontend easy to extend
with pages, filters, curated guides, and eventually models.

## Approach

Use **React Router framework mode, prerendering, and `ssr: false`**. Build HTML
and navigation data from committed `data/data.json`; React hydrates the pages.
Keep GitHub Pages and the Supabase → JSON → git → build publishing flow.
No runtime server or database migration is required.

Canonical entry paths use Ukrainian national transliteration and trailing slashes.
Existing Latin slugs stay unchanged; Cyrillic paths remain compatibility aliases.
English UI copies and aliases canonicalize to the Ukrainian content page.
The sitemap includes only canonical, unfiltered URLs; add language annotations
when the main content is actually translated.

## Stages

### 1. Establish the baseline — complete

Recorded routes, filters, language switching, mobile behavior, and deployment in
[the baseline](docs/frontend-baseline.md). The original 267-entry build shipped
an empty HTML shell and 2,593,639 bytes of JavaScript; entry URLs returned 404.

### 2. Framework mode and prerendering — complete

React Router 7.18.3, React 19.3.0, Vite 8.3.0; npm is authoritative.
Shared layout and build-time loaders generate browse/detail HTML and navigation
data. Slug generation rejects empty or conflicting URLs. RR 7 avoids the RR 8
prerender filesystem failure on long legacy Cyrillic paths.

### 3. Components and data — complete

Preserved rating order, search, facets, URL state, language switching, and history.
Details render available research paragraphs, dates, and sources. Listings contain
only browsing fields and source counts; full research stays out of shared JS.
Mobile facets hydrate consistently and the tab row wraps without clipping.

### 4. Search essentials — complete

Added page titles, descriptions, canonical URLs, headings, sitemap, and robots.txt.
Browse, detail, and language navigation use real links. Browser checks confirmed
metadata updates and language switching with and without JavaScript.

### 5. Verification and release — local acceptance complete

Pages publishes `build/client`, including navigation data and the existing custom
domain. A script-free 404 replaces the copied SPA fallback. PRs run checks only;
main/manual deployments retain notifications. Concurrency is isolated by git ref.

The merged data update produces **268 entries, 568 routes, and 271 sitemap URLs**.
Ten tests and exhaustive artifact/HTTP checks pass. Isolated fixtures also pass
with missing/short research and verify real framework 404/500 error rendering.
Final static-host browser acceptance passed on 2026-09-21: genuine 404s, new-entry
discovery, language/history, no-JavaScript content, and mobile controls; clean consoles.

## Verify locally

Use Node 22.22+ and npm:

```sh
npm ci
npm test
npm run build
npm run verify
npm run preview
```

Preview serves exact static files on port 4173, with directory redirects and real
404s. Verification checks visible HTML separately from scripts, discovery links,
metadata, sitemap, every HTML/data response, and research payload boundaries.

Release through the reviewed branch and pull request.
**Production verification remains pending until merge/deployment:** check direct
entry URLs, unknown URLs, sitemap, navigation data, and language switching on the
custom domain. Any cloud configuration changes are applied by the owner.

## Estimate and follow-up

Original core estimate: **35–55 hours**, including contingency; excludes redesign,
full translation, model ingestion, and Google indexing time.

Later: **first 1–2 curated guides, +8–14 hours**. Use a shared React template with
reviewed selections, introductions, metadata, and prerendered URLs. Add use-case
tags only when needed; reuse the pattern for models when their data exists.
Ratings measure significance, not task performance, so ranked claims need their
own evidence and a clear definition of “Ukrainian.” This follow-up is out of scope.
