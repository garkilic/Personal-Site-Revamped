# Site Redesign Design

**Date:** 2026-04-15  
**Status:** Approved

---

## Overview

Simplify griffinarkilic.com to a single, fully static page. Remove all dynamic components, all blog/writing content, and all projects except two highlighted ones. White background, blue text, monospace font.

---

## Layout

- Single `index.html` page, vertical scroll
- No navigation tabs or separate pages
- Centered content column, generous padding
- All existing pages (`/Pages/projects.html`, `/Pages/prototypes.html`, `/Pages/pdoom.html`) removed

---

## Content (top to bottom)

1. **Name** — `griffin arkilic`
2. **Tagline** — `building things`
3. **Location** — `los angeles, ca`
4. **Projects** (two lines):
   - `solution threads — ai workflows for ria practices ↗` → https://www.solutionthreads.com
   - `spend later — ios deferred spending app ↗` → https://apps.apple.com/us/app/spend-later/id6753609229
5. **Footer links** — `github · email · resume`
   - github → https://github.com/garkilic
   - email → copies `garkilic@gmail.com` to clipboard on click (no mailto, no page navigation)
   - resume → existing PDF at `/Files/`

---

## Visual Style

- **Background:** white (`#ffffff`)
- **Primary text:** blue (`#1d4ed8`)
- **Secondary text (tagline, location, footer):** gray (`#6b7280`)
- **Links:** blue (`#1d4ed8`), no underline by default
- **Font:** monospace — keep existing Roboto Mono from Google Fonts
- **No animations, no transitions, no hover effects beyond cursor change**

---

## JavaScript

- Remove all existing JS (`/js/typing.js`, `/js/github-api.js`, `/js/config.js`)
- Add one inline `<script>` with a single clipboard copy function for the email button
- No external JS libraries (remove marked.js CDN reference)

---

## CSS

- Remove all existing CSS files (`/styles/main.css`, `/styles/prototypes.css`, `/styles/blog.css`, `/styles/typing.css`, all `/styles/components/`)
- Write a single new `styles/main.css` — minimal, ~50 lines

---

## Files to Delete

- `/Pages/projects.html`
- `/Pages/prototypes.html`
- `/Pages/pdoom.html`
- `/js/typing.js`
- `/js/github-api.js`
- `/js/config.js`
- `/styles/prototypes.css`
- `/styles/blog.css`
- `/styles/typing.css`
- `/styles/components/` (entire directory)

## Files to Keep / Modify

- `/index.html` — rewrite completely
- `/styles/main.css` — rewrite completely
- `/Img/` — keep (Skull.jpeg retained but not used on page unless desired later)
- `/Files/` — keep (resume PDF)
- `/.gitignore`, `package.json` — unchanged

---

## Out of Scope

- No CMS, no GitHub Issues blog
- No analytics changes
- No backend / serverless functions
- No mobile-specific breakpoints beyond basic readable column width
