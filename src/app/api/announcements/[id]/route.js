// src/app/api/announcements/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json({ announcement });
}

export async function DELETE(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.announcement.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
