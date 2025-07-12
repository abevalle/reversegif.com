import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Allow AdSense and Google services
  const url = request.url;
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');
  
  // Check if the request is for AdSense resources or if it's a page that will show ads
  const isAdRelated = 
    url?.includes('googlesyndication.com') ||
    url?.includes('doubleclick.net') ||
    url?.includes('googleadservices.com') ||
    referer?.includes('googlesyndication.com') || 
    referer?.includes('google.com') ||
    referer?.includes('doubleclick.net') ||
    origin?.includes('googlesyndication.com') ||
    origin?.includes('google.com') ||
    origin?.includes('doubleclick.net');
  
  // Set headers to enable SharedArrayBuffer for FFmpeg.wasm
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Set permissive headers for AdSense compatibility
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