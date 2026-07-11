# Anthony Grant Portfolio — Build Chat Log

**Project:** Design portfolio for Anthony Grant (ARG Studios)  
**Stack:** React 18, TypeScript, Tailwind CSS, Vite, React Router  
**Fonts:** Space Grotesk, Bricolage Grotesque, Epilogue, DM Mono  
**Generated:** 2026-07-11

---

## Overview

Full design portfolio built from a Figma frame, styled as an editorial design magazine with coral red as the primary color and typography as the primary visual driver.

---

## Session Log

### 1. Initial Build
- Imported Figma frame (`ContentBlock1`) — coral background, large white sans-serif headline, diamond-clipped portrait photo
- Called `create_make_theme` MCP tool to establish editorial magazine stance
- **Fonts chosen:** Bricolage Grotesque (display), Epilogue (body), DM Mono (labels/mono)
- **Palette:** Coral `#FF5A5F`, Near-black `#0C0C0B`, Warm cream `#F6F2EC`
- Built four sections: Hero, Work (Selected Work), About, Contact

### 2. Hero Section
- Large display type: "anthony grant is a Designer of user interfaces / brands / visual artist / living & creating in the Bay Area, California."
- Portrait photo clipped to custom pentagon shape (user-supplied SVG)
- Bent L-shaped scroll arrow (bottom-left) replacing "Contact" link
- `useFitText` hook: binary search `ResizeObserver` that sizes the headline to always fill exactly 60% of the viewport height, responsive to both width and height changes
- Fixed 60vh / 40vh split — text zone / bottom zone — so arrow and portrait are always visible above the fold
- `md:h-screen` locks the hero to exactly one viewport on desktop

### 3. Navigation
- Fixed nav: ARG logo (SVG) top-left, Work / About / Contact links top-right
- Logo color adapts based on active scroll section:
  - Hero, Work, Contact → white
  - About (cream bg) → brand red `#ee3b24`
- Mobile: nav links hidden, "Menu" button expands full-screen overlay
- Logo replaced "AG" text — user supplied SVG, sized to 110px

### 4. ARG Logo
- User uploaded SVG: circular ring with large A letterform, `#ee3b24` brand red
- Inlined as React component with controllable `fill` color
- Color transitions smoothly (0.4s ease) as user scrolls between sections

### 5. Selected Work Section
- Dark background `#0C0C0B`
- 6 projects as full-width typographic rows with coral hover fill
- Hover state: coral background fills row, title goes dark, arrow shifts ↗
- Projects (in order):
  1. **Meta** — Product Design Lead
  2. **Branch International** — Mobile fintech product design
  3. **UJET** — Cloud contact-center SaaS
  4. **Eventbrite** — Brand comms / visual systems
  5. **Tilt** — Brand comms (acquired by Airbnb)
  6. **Facebook F8** — Conference presentation design
- Years removed from all rows and section header
- Floating cursor-following image removed (too complex on mobile)

### 6. Additional Projects — Masonry Grid
- CSS `columns` masonry layout (3 columns, collapses on mobile)
- 23 images pulled from `argstudios.com/illustrations-and-logos` and `argstudios.com/portfolio`
- Images served from Squarespace CDN at `format=750w`
- Hover: label fades in via gradient overlay, image scales 105%
- Clients represented: Tilt, Good Cigar Co., Uprise Fitness, Seltz Co., SF Green Film Festival, Hetchy Vodka, WeatherToons, Resonant People, Silverlake Ramen, Eventbrite SXSW, Livestop, EditLift, Evil Jerk Food Truck, Infinity Search Partners, Pillow.ai, Moonlighting SF, Voltage Records, Jacquline K, Dub 4 the Dancefloor

### 7. About Section
- Cream background `#F6F2EC`
- 12-column grid: label / pull quote + bio / location tag
- Pull quote: "Interfaces that feel inevitable. Brands that earn recognition. Art that refuses easy explanation."
- Disciplines list, links to argstudios.com, anthonyrichardgrant.com, @anthony.r.grant
- Portrait image removed from About section (user request)

### 8. Contact Section
- Coral background, matching Hero
- Large "Let's work together." headline (Bricolage Grotesque, up to 12rem)
- Contact rows: Email, Studio, Art, Instagram
- Dark-red `#7C1515` for labels (matches Figma original)

### 9. Client Popovers (built, then removed from hero)
- Briefly added clickable popovers on "user interfaces" and "brands" text
- Showed Product/UI and Brand client lists on click
- Removed at user request — the font size inheritance issue was fixed but feature was removed
- Client data still lives in `Home.tsx` as `clientLists` for future use

### 10. Typography Iterations
- Name changed to all lowercase: "anthony grant"
- Sentence casing applied throughout
- Combined name + description into one continuous sentence, same font size
- "anthony grant" bold (`fontWeight: 700`), rest light (`fontWeight: 300`)
- Space Grotesk applied to hero headline (user request)
- Final font size: binary-search fitted to 60vh container

### 11. Portrait Clip Shape
- User supplied SVG pentagon shape (asymmetric, cut top-left corner)
- Converted path coordinates to normalized `objectBoundingBox` for scalable `clipPath`
- Applied in both Hero and (removed from) About sections

### 12. React Router — Pages
- Installed `react-router`, configured `createBrowserRouter`
- **Routes:**
  - `/` → `Home.tsx` (full single-page scroll portfolio)
  - `/work/:slug` → `WorkDetail.tsx` (project detail)
  - `*` → `NotFound.tsx`
- **Slugs:** meta, branch, ujet, eventbrite, tilt, facebook-f8
- `WorkDetail` page: fixed nav, full-screen project hero, cover image, placeholder case study blocks, "Next project" footer cycling through all projects
- `NotFound` page: large "Not found." on dark background

### 13. Shared Data
- `src/app/data.ts`: all project data with slugs, `additionalImages`, shared color constants
- `src/app/routes.ts`: router config
- `src/app/App.tsx`: now just `<RouterProvider router={router} />`
- `src/pages/Home.tsx`: all home page content
- `src/pages/WorkDetail.tsx`: project case study template
- `src/pages/NotFound.tsx`: 404

---

## File Structure

```
src/
├── app/
│   ├── App.tsx          # RouterProvider entry point
│   ├── data.ts          # Shared project data + color constants
│   └── routes.ts        # createBrowserRouter config
├── imports/
│   ├── ContentBlock1/
│   │   ├── index.tsx    # Original Figma import (read-only)
│   │   └── *.png        # Portrait photo asset
│   └── ARG_Logo.svg     # Brand logo (user uploaded)
├── pages/
│   ├── Home.tsx         # Full portfolio single-page scroll
│   ├── WorkDetail.tsx   # /work/:slug project detail
│   └── NotFound.tsx     # 404
└── styles/
    ├── fonts.css        # Google Fonts imports
    ├── theme.css        # Design tokens (coral palette)
    └── index.css        # Tailwind + token mappings
```

---

## Design Tokens (theme.css)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#F6F2EC` | Warm cream page background |
| `--foreground` | `#0C0C0B` | Default text |
| `--primary` | `#FF5A5F` | Coral — Hero, Contact, hover states |
| `--primary-foreground` | `#FFFFFF` | Text on coral |
| `--secondary` | `#0C0C0B` | Dark — Work section bg |
| `--muted` | `#E8E3DA` | Subdued surfaces |
| `--accent` | `#FF5A5F` | Coral accent |
| `--radius` | `0rem` | No border radius (editorial, sharp) |

---

## External References

- **Studio:** https://argstudios.com
- **Art:** https://anthonyrichardgrant.com
- **Instagram:** https://instagram.com/anthony.r.grant
- **Figma source:** `src/imports/ContentBlock1/index.tsx`
- **Image sources:** Squarespace CDN (argstudios.com), Unsplash
