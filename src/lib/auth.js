// src/lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me';
const TOKEN_NAME = 'ast_admin_token';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(new RegExp(`${TOKEN_NAME}=([^;]+)`));
  if (!tokenMatch) return null;
  return verifyToken(tokenMatch[1]);
}

export function setAuthCookie(response, token) {
  response.cookies.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  });
}

export function clearAuthCookie(response) {
  response.cookies.set(TOKEN_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
}