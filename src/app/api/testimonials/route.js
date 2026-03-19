// src/app/api/testimonials/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error('[GET /api/testimonials]', err);
    return NextResponse.json({ error: err.message, testimonials: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, role, company, content, imageUrl, badges, rating } = body;

    if (!name || !role || !company || !content) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name, role, company, content,
        imageUrl: imageUrl || null,
        badges: Array.isArray(badges) ? badges : [],
        rating: rating || 5,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/testimonials]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}