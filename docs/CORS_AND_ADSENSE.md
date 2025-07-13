# CORS Headers and AdSense Configuration

This document explains the complex relationship between FFmpeg.wasm requirements and Google AdSense functionality in this project.

## The Problem

This project has two conflicting requirements:

1. **FFmpeg.wasm** needs `SharedArrayBuffer` to function, which requires:
   - `Cross-Origin-Embedder-Policy: require-corp`
   - `Cross-Origin-Opener-Policy: same-origin`

2. **Google AdSense Auto Ads** need to inject scripts and iframes, which is blocked by the above headers

## The Solution

We use conditional middleware (`middleware.js`) that applies different headers based on the page:

### FFmpeg Pages (with restrictive headers)
- `/` - Main reverse GIF tool
- `/video-2-gif` - Video to GIF converter
- `/gif-to-mp4` - GIF to MP4 converter
- `/video-to-png` - Video to PNG frame extractor
- `/video-to-jpg` - Video to JPG frame extractor

**Result**: FFmpeg works, but AdSense auto ads are blocked on these pages.

### All Other Pages (without restrictive headers)
- `/blog/*` - Blog posts
- `/faq` - FAQ page
- `/pricing` - Pricing page
- Any other non-FFmpeg pages

**Result**: AdSense auto ads work perfectly on these pages.

## Trade-offs

1. **AdSense auto ads don't work on FFmpeg tool pages** - This is unavoidable due to browser security requirements
2. **Manual ad units can still work on FFmpeg pages** - But require careful implementation
3. **All non-tool pages get full AdSense support** - Blog, FAQ, etc. can monetize with auto ads

## Important Files

1. **`middleware.js`** - Contains the conditional header logic
2. **`components/AdSenseWrapper.js`** - Loads AdSense script globally
3. **`components/AdUnit.js`** - Manual ad unit implementation
4. **`next.config.js`** - Note the comment about CSP removal

## Adding New Pages

When adding new pages:
- **If the page uses FFmpeg**: Add it to the `needsFFmpeg` array in `middleware.js`
- **If the page doesn't use FFmpeg**: It will automatically get AdSense auto ads support

## Testing

1. **Test FFmpeg functionality**: Upload a GIF/video on tool pages
2. **Test AdSense**: Check browser console for "AdSense auto ads script loaded successfully"
3. **Check for errors**: Look for CORS or CSP blocking errors in console

## Common Issues

1. **"SharedArrayBuffer is not defined"** - Page needs to be added to `needsFFmpeg` list
2. **AdSense not showing on tool pages** - This is expected due to CORS headers
3. **External scripts blocked** - Check if CSP was accidentally re-enabled

## History

- Initially tried `credentialless` COEP to allow both FFmpeg and AdSense - didn't work
- Tried complex CSP rules - too restrictive and broke various services
- Current solution: Conditional headers based on page requirements