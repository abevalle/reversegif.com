# Loading FFmpeg.wasm without errors

Instructions for working on FFmpeg in this repo (reversegif.com). Read this
before touching anything related to GIF/video processing, cross-origin headers,
or the `/download` page. It captures hard-won debugging knowledge — following it
avoids the `SharedArrayBuffer is not defined` / "open this page in a new tab"
class of errors.

## The one thing you must understand

FFmpeg.wasm needs **`SharedArrayBuffer`**. The browser only exposes
`SharedArrayBuffer` when the page is **cross-origin isolated**, which requires
**both** of these HTTP response headers on the *document*:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp` **or** `credentialless`

You can check at runtime: `window.crossOriginIsolated === true`.

**The critical, non-obvious rule:** `crossOriginIsolated` is fixed at
**full-document-load time** and is **immutable**. A Next.js client-side (SPA)
navigation — `next/link`, `router.push` — does **not** create a new document, so
it does **not** re-evaluate these headers. If the first page you loaded wasn't
isolated, every SPA navigation after it stays non-isolated, and FFmpeg will fail
until a real page load happens.

This single fact explains almost every FFmpeg loading bug in this project.

## How headers are configured

All COOP/COEP logic lives in **`middleware.js`** (NOT `next.config.js` — see
"Do not touch" below). Current design:

- **COEP is applied only on FFmpeg tool pages.** COEP is the header that blocks
  AdSense (it gates cross-origin subresource loading), so it's scoped to just the
  pages that need `SharedArrayBuffer`. We use `credentialless` (not
  `require-corp`) so cross-origin resources — e.g. the watermark font fetched
  from an external URL during processing — load without needing CORP headers.
- **COOP is `same-origin` on EVERY page, uniformly.** COOP does not block ads; it
  only controls the browsing-context/opener relationship. But a COOP *mismatch*
  between two pages triggers Firefox/LibreWolf's "the security configuration
  doesn't match the previous page" interstitial on full navigations (e.g. the
  tool page → `/download` hand-off). Keeping COOP identical everywhere avoids
  that warning; isolation is gated purely by the presence of COEP.

The list of FFmpeg pages is `needsFFmpeg` in `middleware.js`:

```js
const needsFFmpeg = [
  '/', '/video-2-gif', '/gif-to-mp4', '/video-to-png', '/video-to-jpg'
].includes(pathname);
```

### Adding a new FFmpeg tool page

1. Add its path to the `needsFFmpeg` array in `middleware.js`. **If you forget
   this, the page loads without COEP and FFmpeg throws `SharedArrayBuffer is not
   defined`.**
2. Make sure users reach it via a **full page load** (see navigation rules), or
   rely on the reload guard in `DropZone` (it's shared, so any page using
   `DropZone` already has it).

## How FFmpeg is loaded in code

- Package: `@ffmpeg/ffmpeg@^0.11.6` + `@ffmpeg/core@^0.11.0` (the
  `createFFmpeg` / `ffmpeg.FS` / `ffmpeg.run` API — NOT the 0.12+ API).
- Core files are served **locally** from `/public/ffmpeg/`
  (`ffmpeg-core.js`, `ffmpeg-core.wasm`, `ffmpeg-core.worker.js`) so they load
  same-origin under COEP. Do not switch to a CDN.
- **Lazy load on user interaction**, never on mount — loading the 24MB wasm
  eagerly hurts performance and is unnecessary until the user processes a file.
  See `pages/DropZone.js` `loadFFmpeg()`:

```js
const ffmpeg = createFFmpeg({ log: true });
// ...called when the user clicks the process button:
if (!ffmpeg.isLoaded()) {
  await ffmpeg.load({
    coreURL: '/ffmpeg/ffmpeg-core.js',
    wasmURL: '/ffmpeg/ffmpeg-core.wasm',
    workerURL: '/ffmpeg/ffmpeg-core.worker.js',
  });
}
```

## The reload guard (why it exists, don't remove it)

`DropZone` runs this on mount. If the component mounts on a tool page that is
*not* isolated (meaning the user arrived via SPA navigation from a non-isolated
page), it forces one full reload so the COOP/COEP headers take effect. The
`sessionStorage` flag prevents an infinite loop if headers are genuinely absent.

```js
useEffect(() => {
  if (typeof window === 'undefined') return;
  if (window.crossOriginIsolated === false) {
    if (!sessionStorage.getItem('coi-reload')) {
      sessionStorage.setItem('coi-reload', '1');
      window.location.reload();
    }
  } else if (window.crossOriginIsolated) {
    sessionStorage.removeItem('coi-reload');
  }
}, []);
```

## Navigation rules

- **Into a tool page** (where FFmpeg runs): a full document load is required for
  isolation. The reload guard handles the SPA case, but prefer plain `<a href>`
  full navigations when linking *to* tool pages to avoid the reload bounce.
- **To `/download`** (or any ad page): must be a **full navigation**
  (`window.location.assign`, not `router.push`). A SPA push would keep the tool
  page's isolated COEP context alive and suppress ads on `/download`. The
  processed file is cached in IndexedDB (`lib/download-cache.js`) precisely so it
  survives the full page load.

## Verifying it works

```bash
# Tool page MUST have both headers:
curl -sI https://reversegif.com/ | grep -i cross-origin
#   cross-origin-embedder-policy: credentialless
#   cross-origin-opener-policy: same-origin

# /download MUST have COOP but NOT COEP (so ads work):
curl -sI https://reversegif.com/download | grep -i cross-origin
#   cross-origin-opener-policy: same-origin   (no COEP line)
```

In the browser console on a tool page:

```js
window.crossOriginIsolated   // true
typeof SharedArrayBuffer     // "function"
```

## Common errors → cause → fix

| Symptom | Cause | Fix |
|---|---|---|
| `SharedArrayBuffer is not defined` / alert "open this page in a new tab" | Page not cross-origin isolated — reached via SPA nav, or path missing from `needsFFmpeg` | Add path to `needsFFmpeg`; ensure full load / the reload guard runs |
| Works only after a manual refresh | SPA navigation into the tool page from a non-isolated page; `crossOriginIsolated` stayed false | Reload guard handles it; or link in via full navigation |
| Firefox: "security configuration doesn't match the previous page" | COOP mismatch on a full navigation | Keep `COOP: same-origin` on every page (already done in middleware) |
| External resource fails to load during processing under COEP | `require-corp` blocks cross-origin resources lacking CORP | Use `COEP: credentialless` (already done) or self-host the resource |
| Ads blank on `/download` | `/download` reached via SPA push, so it inherited the tool page's COEP | Navigate with `window.location.assign`, not `router.push` |

## Do not touch (project rules)

- **Never** put these headers in `next.config.js` or modify scaffold config
  files. All header logic belongs in `middleware.js`.
- Keep FFmpeg core files local in `/public/ffmpeg/`.
- Keep FFmpeg lazy-loaded on user interaction.
