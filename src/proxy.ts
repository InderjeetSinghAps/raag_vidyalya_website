import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static assets to pass through
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const allowedPaths = [
    '/',
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
  ];

  // Allow /notations and its subpaths
  if (pathname.startsWith('/notations')) {
    return NextResponse.next();
  }

  // Redirect any route other than root, auth routes, or notations back to root '/'
  if (!allowedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
