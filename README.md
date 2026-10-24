# SriLankan Airlines — Above the Ordinary (Independent Cinematic Concept)

An **unofficial portfolio redesign concept** inspired by Sri Lanka's national airline. It is **not** affiliated with, endorsed by, or commissioned by SriLankan Airlines.

**Concept and development:** Navod Ravindu Jayaweera · NV SHARP SOLUTIONS

## Included

- Fully functional HTML, CSS, JavaScript website; no runtime package installation.
- Native-scroll-pinned three-chapter journey with aircraft approach, approved exterior fuselage zoom, and cloud-only window portal reveal (no cabin imagery).
- Smooth reverse-scroll choreography derived from scroll progress (no scroll hijacking).
- Mobile navigation, adaptive scenes and interactive destination cards.
- Reduced-motion fallback and keyboard navigation.
- Optimized WebP imagery, including your selected close-up A330 exterior with no cabin visible in that exterior shot.
- Cloudflare Pages-compatible `_headers` with CSP and baseline hardening.

## Run locally

From the project root:

```bash
python -m http.server 8080
```

Open http://localhost:8080/ in a browser. Avoid opening `index.html` directly as a `file://` URL; use a static server for consistent testing.

## Publish with GitHub and Cloudflare Pages

Make a new GitHub repository for this **standalone project**. Upload all files from this folder, preserving `assets/` and `_headers`. Connect it to a Cloudflare Pages project:

- Framework preset: **None**
- Production branch: **main**
- Build command: **(leave blank)**
- Build output directory: **/** (repository root)

Cloudflare Pages may require a build output directory depending on its UI: if so, configure a build command to copy static files to `dist/`, then use `dist` as output. `_headers` must be included in the published output.

## Design / asset notes

- The aircraft and cabin visuals are concept artwork, not verified documentation of real aircraft details.
- The earlier exterior window close-up showing the cabin has been removed from the project and replaced with the separately approved close-side aircraft image. All interior-window assets have been removed; the window transition now reveals a separate golden cloud plate.
- The project intentionally contains **no booking/payment forms**, tracking, external video, or secret credentials.
- Seedance 2.5 video is **not included** in this build. Video production and approval remain separate; no replacement model was used.
- For publication, verify rights to all brand elements. The small abstract three-stripe emblem in the UI is an original navigation treatment, **not** an official logo.
- No third-party JavaScript libraries, CDN JS, analytics, cookies, or APIs are required.
- Google Fonts are used for typography; system sans-serif fallbacks are available if offline.

## Choreography tuning

See `app.js`. Progress ranges from `0` (enter pinned section) to `1` (exit pinned section). Tune:

- Aircraft approach: `smooth(.02,.58,p)`
- Exterior window reveal: `smooth(.28,.48,p)`
- Interior reveal: `smooth(.59,.9,p)`
- Chapter thresholds: `.36`, `.72`

Cinematic V2 uses one native sticky scene and an optimized scroll timeline without external JS. The blueprint proposed GSAP, but GSAP could not be downloaded in this offline build environment; no third-party runtime or unverified CDN dependency was added. A future GSAP conversion is optional. No frame-by-frame match is claimed.

## Cinematic V2 choreography

- Scroll stages: 0–15% hero, 15–36% glide, 36–52% approved exterior, 52–78% straight window push, 78–94% cloud-only portal, 94–100% sky handoff.
- No forced scrolling or rotation; chapter opacity, scale and portal radius are reversible.
- Mobile uses a crossfade and lower zoom; reduced-motion displays a stationary image.
- Reverse-scroll, mobile navigation, desktop/mobile layout, and security header checks are described in TESTING.md.
