// middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

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
