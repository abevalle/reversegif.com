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
  
  // For all pages (to ensure ads can load)
  // Remove restrictive headers that block AdSense
  response.headers.delete('Cross-Origin-Embedder-Policy');
  response.headers.delete('Cross-Origin-Opener-Policy');
  response.headers.delete('X-Frame-Options');
  
  // Set permissive headers for AdSense compatibility
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
  // Add Content Security Policy that allows AdSense
  const cspHeader = [
    "default-src 'self' https: data: blob:",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googlesyndication.com https://*.google.com https://*.googletagmanager.com https://*.googleapis.com https://*.gstatic.com https://*.doubleclick.net https://*.googleadservices.com",
    "style-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://*.gstatic.com",
    "connect-src 'self' https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.googleadservices.com https://*.google-analytics.com https://*.googletagmanager.com",
    "frame-src 'self' https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
    "frame-ancestors 'self' https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
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