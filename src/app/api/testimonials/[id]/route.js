// src/app/api/testimonials/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function PATCH(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const testimonial = await prisma.testimonial.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json({ testimonial });
}

export async function DELETE(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.testimonial.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
