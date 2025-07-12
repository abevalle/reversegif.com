import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  const url = request.url;
  const pathname = new URL(url).pathname;
  
  // Only apply restrictive headers for pages that need FFmpeg.wasm
  const needsFFmpeg = [
    '/',
    '/video-2-gif', 
    '/gif-to-mp4',
    '/video-to-png',
    '/video-to-jpg'
  ].includes(pathname);
  
  if (needsFFmpeg) {
    // Try a less restrictive approach for SharedArrayBuffer
    // Use credentialless instead of require-corp to avoid blocking external resources
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  }
  
  // Set permissive headers for all pages to allow external resources
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Remove CSP restrictions to allow FFmpeg and other tools to work
  // CSP was causing issues with unpkg.com and other CDN resources
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