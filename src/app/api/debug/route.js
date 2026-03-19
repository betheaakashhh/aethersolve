// src/app/api/debug/route.js
// TEMPORARY - delete after debugging
import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    node_version: process.version,
    env_check: {
      DATABASE_URL: process.env.DATABASE_URL ? `SET (starts with: ${process.env.DATABASE_URL.substring(0, 30)}...)` : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
    prisma_test: null,
    prisma_error: null,
  };

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    const count = await prisma.testimonial.count();
    await prisma.$disconnect();
    results.prisma_test = `SUCCESS - testimonial count: ${count}`;
  } catch (err) {
    results.prisma_error = {
      message: err.message,
      code: err.code,
      stack: err.stack?.split('\n').slice(0, 5).join(' | '),
    };
  }

  return NextResponse.json(results);
}