import { NextResponse } from 'next/server';

/**
 * Middleware to handle the conflicting requirements between FFmpeg.wasm and AdSense
 * 
 * IMPORTANT: This middleware balances two conflicting requirements:
 * 
 * 1. FFmpeg.wasm requires SharedArrayBuffer, which needs:
 *    - Cross-Origin-Embedder-Policy: require-corp
 *    - Cross-Origin-Opener-Policy: same-origin
 *    These headers block external scripts and iframes (including AdSense)
 * 
 * 2. AdSense auto ads require:
 *    - No restrictive CORS headers (they inject iframes and scripts)
 *    - No CSP restrictions
 *    - No X-Frame-Options
 * 
 * SOLUTION: We conditionally apply headers based on the page:
 * - FFmpeg pages: Get restrictive headers (sacrificing AdSense on those pages)
 * - Other pages: Get permissive headers (allowing AdSense auto ads)
 * 
 * TRADE-OFFS:
 * - AdSense auto ads won't work on FFmpeg tool pages (/, /video-2-gif, etc.)
 * - Manual ad units can still work on FFmpeg pages with proper implementation
 * - All other pages get full AdSense auto ads support
 * 
 * @param {Request} request - The incoming request
 * @returns {Response} The response with appropriate headers
 */
export function middleware(request) {
  const response = NextResponse.next();
  
  const url = request.url;
  const pathname = new URL(url).pathname;
  
  // List of pages that use FFmpeg.wasm and need SharedArrayBuffer
  // IMPORTANT: Update this list if you add new FFmpeg-based tools
  const needsFFmpeg = [
    '/',              // Main reverse GIF tool
    '/video-2-gif',   // Video to GIF converter
    '/gif-to-mp4',    // GIF to MP4 converter
    '/video-to-png',  // Video to PNG frame extractor
    '/video-to-jpg'   // Video to JPG frame extractor
  ].includes(pathname);
  
  // Check if this is a blog page
  const isBlogPage = pathname.startsWith('/blog');
  
  if (needsFFmpeg) {
    // FFmpeg pages: Apply headers for SharedArrayBuffer support
    // WARNING: This will block AdSense auto ads on these pages
    // Using 'credentialless' allows loading cross-origin resources without credentials
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  } else if (isBlogPage) {
    // Blog pages: Explicitly remove restrictive headers to ensure images load properly
    response.headers.delete('Cross-Origin-Embedder-Policy');
    response.headers.delete('Cross-Origin-Opener-Policy');
    // Ensure permissive CORP for blog images
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  } else {
    // Other non-FFmpeg pages: Remove restrictive headers to allow AdSense auto ads
    // This enables full AdSense functionality on FAQ, and other pages
    response.headers.delete('Cross-Origin-Embedder-Policy');
    response.headers.delete('Cross-Origin-Opener-Policy');
  }
  
  // Global headers applied to all pages:
  
  // Remove X-Frame-Options to allow AdSense and other services to embed content
  response.headers.delete('X-Frame-Options');
  
  // Set permissive CORP to allow cross-origin resource loading
  // This allows external scripts like Buy Me a Coffee, Vercel Analytics, etc.
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Remove Content-Security-Policy entirely
  // CSP was blocking critical resources: unpkg.com (FFmpeg), Buy Me a Coffee, Vercel Analytics
  // Removing it allows all external scripts to load properly
  response.headers.delete('Content-Security-Policy');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};