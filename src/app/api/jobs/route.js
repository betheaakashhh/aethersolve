// src/app/api/jobs/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isInternship = searchParams.get('isInternship');

    const where = { isActive: true };
    if (isInternship === 'true') where.isInternship = true;
    if (isInternship === 'false') where.isInternship = false;

    const jobs = await prisma.jobPosting.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return NextResponse.json({ error: err.message, jobs: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, department, location, type, isInternship, description, requirements, skills } = body;

    if (!title || !department || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.jobPosting.create({
      data: {
        title, department, location: location || 'Remote',
        type: type || 'full-time',
        isInternship: Boolean(isInternship),
        description,
        requirements: Array.isArray(requirements) ? requirements : [],
        skills: Array.isArray(skills) ? skills : [],
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/jobs]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}