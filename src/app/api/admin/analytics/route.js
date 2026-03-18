// src/app/api/admin/analytics/route.js - rewritten without raw SQL
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { subDays, format } from 'date-fns';

export async function GET(request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();

    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      declinedApplications,
      reviewingApplications,
      internApplications,
      professionalApplications,
      recentApplications,
      allLast14Days,
      allForDepts,
    ] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'pending' } }),
      prisma.application.count({ where: { status: 'approved' } }),
      prisma.application.count({ where: { status: 'declined' } }),
      prisma.application.count({ where: { status: 'reviewing' } }),
      prisma.application.count({ where: { isIntern: true } }),
      prisma.application.count({ where: { isIntern: false } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { job: { select: { title: true, department: true } } },
      }),
      prisma.application.findMany({
        where: { createdAt: { gte: subDays(now, 14) } },
        select: { createdAt: true },
      }),
      prisma.application.findMany({
        select: { jobId: true },
      }),
    ]);

    // Build 14-day trend — pure JS, no raw SQL
    const weeklyData = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = allLast14Days.filter(
        a => format(new Date(a.createdAt), 'yyyy-MM-dd') === dateStr
      ).length;
      weeklyData.push({ date: format(date, 'MMM dd'), count });
    }

    // Department breakdown — pure JS
    const jobIds = [...new Set(allForDepts.map(a => a.jobId).filter(Boolean))];
    const jobs = jobIds.length
      ? await prisma.jobPosting.findMany({
          where: { id: { in: jobIds } },
          select: { id: true, department: true },
        })
      : [];

    const deptMap = {};
    allForDepts.forEach(app => {
      const job = jobs.find(j => j.id === app.jobId);
      if (job?.department) {
        deptMap[job.department] = (deptMap[job.department] || 0) + 1;
      }
    });
    const departmentChart = Object.entries(deptMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      stats: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        declined: declinedApplications,
        reviewing: reviewingApplications,
        interns: internApplications,
        professionals: professionalApplications,
      },
      weeklyData,
      departmentChart,
      recentApplications,
    });

  } catch (err) {
    console.error('[Analytics Error]', err);
    return NextResponse.json(
      { error: 'Analytics failed', detail: err.message },
      { status: 500 }
    );
  }
}