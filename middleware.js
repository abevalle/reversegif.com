import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Allow AdSense and Google services
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');
  
  // Check if the request is for AdSense resources
  if (referer?.includes('googlesyndication.com') || 
      referer?.includes('google.com') ||
      origin?.includes('googlesyndication.com') ||
      origin?.includes('google.com')) {
    // Remove restrictive headers for AdSense requests
    response.headers.delete('Cross-Origin-Embedder-Policy');
    response.headers.delete('Cross-Origin-Opener-Policy');
  }
  
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