// middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip middleware for /blog routes
  if (pathname.startsWith('/blog')) {
    return NextResponse.next();
  }

  // Handle legacy URLs (4-character codes)
  if (pathname.match(/^\/[a-zA-Z0-9]{4}$/)) {
    const url = new URL(req.url);
    return NextResponse.redirect(new URL('/', url), 301);
  }

  // Apply middleware only for image file requests
  if (pathname.match(/\.(gif|jpg|jpeg|tiff|png)$/)) {
    const url = new URL(req.url);
    const filePath = `${url.origin}${pathname}`;

    try {
      const response = await fetch(filePath, { method: 'HEAD' });
      if (!response.ok) {
        // File does not exist, rewrite to the default image
        return NextResponse.rewrite(new URL('/default-image.png', url));
      }
    } catch (err) {
      // If there's an error in fetching, rewrite to the default image
      return NextResponse.rewrite(new URL('/default-image.png', url));
    }
  }

  return NextResponse.next();
}
