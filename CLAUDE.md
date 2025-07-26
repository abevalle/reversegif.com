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