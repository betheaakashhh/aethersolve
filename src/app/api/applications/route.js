// src/app/api/applications/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const role = searchParams.get('role');
  const isIntern = searchParams.get('isIntern');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where = {};
  if (status && status !== 'all') where.status = status;
  if (isIntern === 'true') where.isIntern = true;
  if (isIntern === 'false') where.isIntern = false;
  if (role) where.job = { title: { contains: role, mode: 'insensitive' } };

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { job: { select: { title: true, department: true, isInternship: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.application.count({ where }),
  ]);

  return NextResponse.json({ applications, total, page, limit });
}

export async function PATCH(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, adminNotes } = await request.json();
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const application = await prisma.application.update({
    where: { id },
    data: { status, adminNotes },
    include: { job: true },
  });

  return NextResponse.json({ application });
}
