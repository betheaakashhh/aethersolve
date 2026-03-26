// src/app/api/blog/[slug]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

// ── Public: get single post by slug ──────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
    if (!post || (!post.isPublished && !getAdminFromRequest(request))) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[GET /api/blog/slug]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Admin: update post ────────────────────────────────────────────────────────
export async function PATCH(request, { params }) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    // If publishing for first time, set publishedAt
    const existing = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    const publishedAt = body.isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt;

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: { ...body, publishedAt },
    });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[PATCH /api/blog/slug]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Admin: delete post ────────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.blogPost.delete({ where: { slug: params.slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/blog/slug]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}