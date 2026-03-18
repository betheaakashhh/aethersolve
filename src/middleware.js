// src/middleware.js
import { NextResponse } from 'next/server';

function isValidToken(token) {
  try {
    if (!token) return false;
    // JWT is 3 base64url parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    // Decode payload and check expiry
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('ast_admin_token')?.value;
    if (!isValidToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};