// src/app/api/announcements/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  return NextResponse.json({ announcements });
}

export async function POST(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, content, link, linkText } = await request.json();
  if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const announcement = await prisma.announcement.create({
    data: { title, content, link: link || null, linkText: linkText || null },
  });
  return NextResponse.json({ announcement }, { status: 201 });
}
