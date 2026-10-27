# Cinematic V3 — Test Results

## V3 verification — October 27, 2026

- `node --check app.js` passes.
- Headless Chromium 155 loaded the project over a local HTTP server with the general security headers from `_headers`. Google Fonts requests were deliberately blocked; these checks used system fallback fonts.
- Desktop at 1440×900: pointer movement updates hero depth and destination-card tilt. Computed card transforms include 3D rotation after the reveal; hover activates shine and image zoom.
- Touch at 390×844 and 1280×900: hero pointer depth, card tilt, shine and image zoom stay disabled. Cards remain visible, with no horizontal overflow.
- Reduced motion at 1440×900: pointer depth, tilt, shine and image zoom stay disabled; cards remain visible, with no horizontal overflow.
- Mobile navigation opens with `aria-expanded="true"` and closes with Escape.
- No JavaScript runtime exceptions occurred in the four browser profiles. These checks do not verify the Cloudflare deployment or downloaded Google Fonts.

## Archived V2 verification

**Date:** October 24, 2026  
**Project:** Above the Ordinary — Unofficial SriLankan Airlines Concept  
**Developer credit:** Navod Ravindu Jayaweera · NV SHARP SOLUTIONS

## Confirmed checks

- ✅ JavaScript syntax passes `node --check app.js`.
- ✅ Desktop Chromium **in-memory rendering** at 1440×900: sampled flight stages 0%, 15%, 36%, 52%, 78%, 94%, 100%, then reversed to 78%, 52%, 15%, 0%.
- ✅ Mobile Chromium **in-memory rendering** at 390×844: same forward and reverse scroll stages.
- ✅ Desktop/mobile chapters advance from 01 → 02 → 03, then reverse 03 → 02 → 01 without lost state.
- ✅ Aircraft image fades into the selected exterior photograph, then a cloud-only portal.
- ✅ Desktop/mobile page tests returned no JavaScript runtime errors or horizontal overflow.
- ✅ Destination-card reveal became visible after scrolling into its section.
- ✅ Mobile navigation opens, and Escape closes it with correct `aria-expanded` state.
- ✅ Reduced-motion preference disables scroll effects and displays stationary content.
- ✅ Search of shipped assets and styles confirms previous `interior-window` photos are no longer used.

## Environment limits and implementation choices

- The earlier V2 runtime's Chromium blocked `http://127.0.0.1` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so those tests loaded the **same project HTML/CSS/JS plus local images into an in-memory Chromium page**. This verifies browser rendering and animation behavior, but **does not replace testing the deployed URL in a real browser**, including asset loading through the actual HTTP server and production CSP.
- The GSAP ScrollTrigger code envisaged in the earlier blueprint is **not included** because no local library was available and this environment could not download it. The V2 project instead uses one native sticky scene plus an offline scroll-progress engine. No two animation systems compete over the same elements.
- The cinematic portal is a stylized transition between photographic still images, not actual moving footage or real 3D geometry.
- Generated concept imagery is not verified as an exact aircraft/livery reference; check permitted branding and image use before publication.

## Follow-up manual verification

1. Serve the folder using `python -m http.server 8080` and open http://localhost:8080/ on Windows.
2. Scroll down past all three chapters and back up: no jumps, stuck pin, or incorrect captions.
3. Verify responsive layout at 390, 768, 1440 px; check browser console, image loading, mobile menu and anchor navigation.
4. Turn on your operating system's Reduce Motion setting, reload and verify the static version.
5. Publish as an **unofficial independent concept** only after reviewing trademark and image rights.
