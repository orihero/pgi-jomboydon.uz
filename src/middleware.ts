import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { languages, defaultLanguage } from './i18n/config';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = Object.keys(languages);
  const languageList = new Negotiator({ headers: negotiatorHeaders }).languages();
 
  return matchLocale(languageList, locales, defaultLanguage);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip language redirect for admin routes and uploads
  if (pathname.startsWith('/admin') || pathname.startsWith('/uploads')) {
    return;
  }

  const pathnameIsMissingLocale = Object.keys(languages).every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|images|uploads|favicon.ico).*)',
  ],
}; 