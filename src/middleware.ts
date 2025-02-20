import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ru', 'uz'] as const;
const defaultLocale = 'uz';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static assets and api routes
  if (
    pathname.startsWith('/uploads/') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/videos/') ||
    pathname.startsWith('/admin/')
  ) {
    return;
  }

  // Check if pathname has a supported locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if no locale
  const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|videos|admin).*)'
  ]
}; 