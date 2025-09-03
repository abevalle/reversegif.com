import { NextResponse } from 'next/server';

/**
 * Middleware to handle headers for the application
 * 
 * This middleware removes restrictive headers to allow:
 * - AdSense auto ads to work properly
 * - External scripts and resources to load
 * - Cross-origin images and media
 * 
 * @param {Request} request - The incoming request
 * @returns {Response} The response with appropriate headers
 */
export function middleware(request) {
  const response = NextResponse.next();
  
  // Remove restrictive headers to allow AdSense and external resources
  response.headers.delete('Cross-Origin-Embedder-Policy');
  response.headers.delete('Cross-Origin-Opener-Policy');
  response.headers.delete('X-Frame-Options');
  response.headers.delete('Content-Security-Policy');
  
  // Set permissive CORP to allow cross-origin resource loading
  // This allows external scripts like Buy Me a Coffee, Vercel Analytics, AdSense, etc.
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  
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