// src/app/api/admin/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
    const response = NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
    setAuthCookie(response, token);

    return response;
  } catch (err) {
    console.error('[Login Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
