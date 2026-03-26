// src/app/api/blog/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// ── Public: get published posts ───────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit    = parseInt(searchParams.get('limit') || '20');
    const page     = parseInt(searchParams.get('page')  || '1');

    const where = { isPublished: true };
    if (category && category !== 'all') where.category = category;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverImage: true, category: true, tags: true,
          author: true, authorRole: true, source: true,
          linkedinUrl: true, readTime: true, publishedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit });
  } catch (err) {
    console.error('[GET /api/blog]', err);
    return NextResponse.json({ error: err.message, posts: [] }, { status: 500 });
  }
}

// ── Admin: create post ────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      title, slug, excerpt, content, coverImage,
      category, tags, author, authorRole,
      source, linkedinUrl, isPublished,
      metaTitle, metaDescription, readTime,
    } = body;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'title, slug, excerpt, content, category are required' }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug already exists — choose a different one' }, { status: 409 });

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage || null,
        category,
        tags: Array.isArray(tags) ? tags : [],
        author:     author     || 'AetherSolve Team',
        authorRole: authorRole || null,
        source:     source     || 'internal',
        linkedinUrl: linkedinUrl || null,
        isPublished: Boolean(isPublished),
        publishedAt: isPublished ? new Date() : null,
        metaTitle:       metaTitle       || null,
        metaDescription: metaDescription || null,
        readTime: readTime ? parseInt(readTime) : 5,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/blog]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}