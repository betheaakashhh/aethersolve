// src/app/api/jobs/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request, { params }) {
  const job = await prisma.jobPosting.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PATCH(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const job = await prisma.jobPosting.update({
    where: { id: params.id },
    data: body,
  });
  return NextResponse.json({ job });
}

export async function DELETE(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.jobPosting.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
