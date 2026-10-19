# Architecture Studio — Homepage Preset

A reusable, editorial homepage for architecture / design studios. Demo studio: **Halden. Architecture Studio** (fictional).

Next.js 15 (static export) · GSAP 3 + ScrollTrigger + SplitText · Lenis · plain CSS. No UI libraries.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out — upload anywhere
npm run images     # rebuild responsive AVIF/WebP from assets-src/
```

## Re-skin for a new studio

1. **Copy** — edit `lib/content.ts`. Every visible string lives there: studio details, nav, the five hero projects, archive grid, manifesto, practice pillars, process layers, awards, clients, studio section, footer line.
2. **Images** — put photos in `assets-src/`, map them in `scripts/images.mjs`, add the keys to `ImageKey` in `lib/content.ts`, run `npm run images`. Hero images work best landscape, ≥ 2000px wide.
3. **Signature word** — `morph.from` / `morph.to` in `content.ts` (same number of letters; shared letters stay in place). Default: VOID → FORM.
4. **Colour & type** — tokens at the top of `app/globals.css`: `--paper`, `--ink`, `--night`, `--accent`, and weights `--w-display` / `--w-head` / `--w-body` / `--w-ui`. Fonts are set in `app/layout.tsx`.
5. **Logo** — the nav mark is a CSS square (`.symbol` in `globals.css`); replace with an SVG if the studio has one. Favicon is generated in `scripts/images.mjs`.

## Sections

| # | Section | Motion |
|---|---------|--------|
| 01 | Hero — five projects | Sticky scroll sequence; each project uncovers the last; PREV/NEXT with image peek |
| 02 | Manifesto | Grid rule continues from the hero; masked line reveals |
| 03 | Project index | Large rows; cursor-trailing preview; inline images on touch |
| 04 | Word morph | Pinned; outlined word wiped into solid word over drawn contours; quote resolves word by word |
| 05 | Practice | Sticky numeral + title, three panels, background tone shifts |
| 06 | Process layers | Pinned isometric stack assembled layer by layer |
| 07 | Awards | Archive table with drawn rules |
| 08 | Interlude | Inset image opens to full bleed |
| 09 | Archive grid | Asymmetric spread, drifting outline type |
| 10 | Clients | Typographic wordmarks on a hairline grid |
| 11 | Studio | City type, studio photograph, team list |
| 12 | Footer | Wordmark rises and stays cropped by the viewport edge |

Accessibility: `prefers-reduced-motion` turns off smoothing, pinning and scrubbed sequences; custom cursor only on fine pointers; focus-trapped menu dialog; hover content has focus/touch equivalents.

## Demo content

Studio, people, projects, clients and awards are **fictional**. The quote is Louis I. Kahn's. Photographs are from Unsplash (free licence) — see `assets-src/CREDITS.md`; replace with the client's own work before launch.
