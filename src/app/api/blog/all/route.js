

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        category: true, source: true, isPublished: true,
        readTime: true, publishedAt: true, createdAt: true,
        author: true, tags: true, linkedinUrl: true,
      },
    });

    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[GET /api/blog/all]', err);
    return NextResponse.json({ error: err.message, posts: [] }, { status: 500 });
  }
}