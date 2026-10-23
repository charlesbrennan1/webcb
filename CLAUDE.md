# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Charles Brennan's personal portfolio site (charlesbrennan1/webcb). Pure static HTML/CSS/JS — no build step, no package.json, no framework, no tests, no linter. Edit files directly and refresh.

**The live site deploys from `main`.** Always verify changes on a local server before pushing to main; do feature work on a branch.

## Local development

```bash
npx http-server -p 8742 -c-1
```

`.claude/launch.json` defines this as the `site` preview config. There is no compile step — what's in the repo is what's served.

## Architecture

### Pages are standalone — shared markup is duplicated

All 16 HTML pages are self-contained. The header/nav and footer are copy-pasted into every page, so a nav change must be applied to **every** `*.html` file. Page groups:

- `index.html`, `about.html`, `contact.html`, `research.html`, `nucleus.html` — top-level pages
- `tlf.html` — hub linking to `tlf-*.html` subpages and case studies (`kpi-analysis.html`, `inventory-turnover-analysis.html`, `multi-order-picking-config.html`, `distribution-workflows.html`, `global-shipping-analysis.html`, `tlf-times-weekly-ops.html`)

### Shared CSS and JS

- `styles.css` — the single shared stylesheet. Design tokens live in `:root` CSS variables (`--space-*`, `--accent-*`, `--text`, `--muted`, `--border-radius`, `--duration-*`/`--easing`); use these rather than hard-coded values. Pages also carry page-specific inline `<style>` blocks and inline styles.

  It holds 25 `!important` declarations, and every one is load-bearing — they are not stylistic habit. They fall into three groups: the `prefers-reduced-motion` block (9), overrides of Leaflet's CDN stylesheet for map popups (8), and mobile overrides where a later `@media (max-width: 768px)` rule for the same selector would otherwise win (8, on `.about-content p`, `.contact-panel`, `.role-photos-grid`, and `.role-photo-card img`). Removing any of the last group visibly changes mobile layout. Before adding a new one, check whether an earlier duplicate rule for the same selector is the real problem.
- `script.js` — loaded by every page. The `WebsiteInteractions` class wires up scroll-reveal (add class `reveal` to any element to animate it in), kinetic nav underlines, copy buttons, the mobile menu, image fallbacks, and work-card filters.

### Per-page canvas/JS

- `ribbon.js` — hero background animation on `index.html`
- `about-bg.js` — neural-lattice background on `about.html`
- `travel-map.js` — Leaflet map on `nucleus.html` (Leaflet loaded from unpkg CDN; the only external JS dependency). It is **not** a plain `<script src>`: an inline script at the bottom of `nucleus.html` injects it 100ms after `DOMContentLoaded`, so grepping for the filename in a `<script src>` turns up nothing. Tiles come from Esri World Dark Gray Canvas, which needs no API key and uses `{z}/{y}/{x}` ordering (row before column). CARTO's basemaps were dropped because they now return a watermarked "API KEY REQUIRED" tile with an HTTP 200, which fails silently with no console error.

### research.html data

The 162 research reports are an inline JSON array (`allReports`, ~line 315 of `research.html`) rendered client-side with year/topic filtering. To add or edit reports, edit that array. An archived copy of the data lives at `originals/documents/research_portfolio_updated.json` — keep the two in sync.

Each report carries `year`, `date` (ISO), `title`, `url`, `slug`, `topic_area`, `report_number`, `report_type`, and `vendor`/`vendor_url`/`logo` (null falls back to the Nucleus logo and nucleusresearch.com). Cards render newest-first by `date`, and show `date · report_type report_number` under the title. Report numbers come from the report's own page on nucleusresearch.com, in the `<h1 itemprop="headline">` element's sibling `<div class="meta">` — not the "Related Research" sidebar, which uses `meta text-uc` and will silently yield the wrong number.

### Assets

- `assets/img/` — optimized images referenced by pages (webp/avif, kebab-case names)
- `assets/docs/` — PDFs linked from pages (resume, research paper)
- `assets/fonts/` — self-hosted Inter woff2 files (no Google Fonts; declared via `@font-face` at the top of `styles.css`)
- `originals/` — unoptimized source photos, logos, and documents. **Nothing in `originals/` is referenced by the site.** New site images should be optimized (webp) into `assets/img/` with kebab-case names, keeping the source in `originals/`.

When moving or renaming any asset, grep all `*.html`, `*.css`, and `*.js` for references (`src`, `href`, and CSS `url()`) and update them — broken links won't surface until someone clicks them in production.
