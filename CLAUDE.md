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
- `script.js` — loaded by every page. The `WebsiteInteractions` class wires up scroll-reveal (add class `reveal` to any element to animate it in), kinetic nav underlines, copy buttons, the mobile menu, image fallbacks, and work-card filters.

### Per-page canvas/JS

- `ribbon.js` — hero background animation on `index.html`
- `about-bg.js` — neural-lattice background on `about.html`
- `travel-map.js` — Leaflet map on `nucleus.html` (Leaflet loaded from unpkg CDN; the only external JS dependency)
- `tlf-road.js` and `tlf-constellation.js` exist but are **not referenced by any page** (leftovers from an earlier tlf.html design)

### research.html data

The 144 research reports are an inline JSON array (`allReports`, ~line 219 of `research.html`) rendered client-side with year/topic filtering. To add or edit reports, edit that array. An archived copy of the data lives at `originals/documents/research_portfolio_updated.json`.

### Assets

- `assets/img/` — optimized images referenced by pages (webp/avif, kebab-case names)
- `assets/docs/` — PDFs linked from pages (resume, research paper)
- `assets/fonts/` — self-hosted Inter woff2 files (no Google Fonts; declared via `@font-face` at the top of `styles.css`)
- `originals/` — unoptimized source photos, logos, and documents. **Nothing in `originals/` is referenced by the site.** New site images should be optimized (webp) into `assets/img/` with kebab-case names, keeping the source in `originals/`.

When moving or renaming any asset, grep all `*.html`, `*.css`, and `*.js` for references (`src`, `href`, and CSS `url()`) and update them — broken links won't surface until someone clicks them in production.
