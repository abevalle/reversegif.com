# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ReverseGIF.com Project Notes

## Image and File Storage
- Blog images and files are stored on DigitalOcean Spaces
- URLs should use the CDN endpoint: `nyc3.cdn.digitaloceanspaces.com` (not `nyc3.digitaloceanspaces.com`)
- Blog post thumbnails are fetched from Strapi API and should display images from DigitalOcean Spaces

## Testing Commands
When making changes, run these commands to ensure code quality:
- `npm run lint` - Check for linting errors
- `npm run typecheck` - Check for TypeScript errors (if applicable)

## Architecture Notes
- The site uses Next.js for the frontend
- Strapi CMS is used for blog content management
- FFmpeg.wasm is used for GIF processing directly in the browser
- All GIF processing happens client-side for privacy

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run build:prod` - Run optimizations and build for production (cleans .next directory first)
- `npm run start` - Start production server
- `npm run optimize` - Run pre-build optimizations

## Key Architectural Decisions

### FFmpeg.wasm Integration
FFmpeg is loaded lazily when users click process buttons to avoid COEP conflicts. The FFmpeg files are served from `/public/ffmpeg/`.

**IMPORTANT: Before changing anything related to FFmpeg loading, cross-origin
headers, SharedArrayBuffer, or the `/download` page, read
[`docs/FFMPEG_LOADING.md`](docs/FFMPEG_LOADING.md).** It documents the
cross-origin-isolation rules (and the SPA-navigation gotcha) that prevent the
`SharedArrayBuffer is not defined` / "open this page in a new tab" errors.

### CORS and Header Management
The `middleware.js` file handles complex header requirements:
- FFmpeg pages need `Cross-Origin-Embedder-Policy: credentialless` for SharedArrayBuffer support
- COOP is set to `same-origin` uniformly on every page to avoid Firefox's COOP-mismatch interstitial; only COEP is toggled to control isolation
- Other pages omit COEP so AdSense can load
- Full details and troubleshooting: [`docs/FFMPEG_LOADING.md`](docs/FFMPEG_LOADING.md)

### Strapi API Integration
- API client is in `/lib/strapi-api.js`
- Environment variables: `NEXT_PUBLIC_STRAPI_API_URL` and `NEXT_PUBLIC_STRAPI_API_TOKEN`
- Blog posts use dynamic routing with `[slug].js`

### Image Configuration
The Next.js image component is configured to allow:
- Coolify domains (`**.coolify.valle.us`)
- DigitalOcean Spaces (`**.digitaloceanspaces.com`)
- Giphy media (`media.giphy.com`)