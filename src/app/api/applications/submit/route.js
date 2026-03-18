// src/app/api/applications/submit/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAdminNotification, sendApplicationAcknowledgement } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      jobId, firstName, lastName, email, phone,
      currentRole, previousCompany, skills, experienceYears,
      isIntern, collegeName, degree, yearOfStudy, cgpa, graduationYear,
      resumeUrl, driveResumeUrl, coverLetter, portfolioUrl, linkedinUrl,
    } = body;

    if (!jobId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const existing = await prisma.application.findFirst({ where: { jobId, email } });
    if (existing) {
      return NextResponse.json({ error: 'You have already applied for this position' }, { status: 409 });
    }

    const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    // Merge resumeUrl and driveResumeUrl — prefer uploaded file, fallback to drive link
    const finalResumeUrl = resumeUrl || driveResumeUrl || null;
    // Store drive link separately in portfolioUrl if no other portfolio provided
    const finalPortfolioUrl = portfolioUrl || (driveResumeUrl && !resumeUrl ? driveResumeUrl : null);

    const application = await prisma.application.create({
      data: {
        jobId,
        firstName:       firstName.trim(),
        lastName:        lastName.trim(),
        email:           email.toLowerCase().trim(),
        phone:           phone.trim(),
        currentRole:     currentRole?.trim()     || null,
        previousCompany: previousCompany?.trim() || null,
        skills: Array.isArray(skills)
          ? skills
          : skills?.split(',').map(s => s.trim()).filter(Boolean) || [],
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        isIntern:        Boolean(isIntern),
        collegeName:     collegeName?.trim()     || null,
        degree:          degree?.trim()          || null,
        yearOfStudy:     yearOfStudy?.trim()     || null,
        cgpa:            cgpa?.trim()            || null,
        graduationYear:  graduationYear?.trim()  || null,
        resumeUrl:       finalResumeUrl,
        coverLetter:     coverLetter?.trim()     || null,
        portfolioUrl:    finalPortfolioUrl,
        linkedinUrl:     linkedinUrl?.trim()     || null,
      },
      include: { job: true },
    });

    // Fire both emails — don't block response if they fail
    Promise.all([
      sendAdminNotification(application, job).catch(e => console.error('[Email admin notify]', e)),
      sendApplicationAcknowledgement(application, job).catch(e => console.error('[Email ack]', e)),
    ]);

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err) {
    console.error('[Submit Application Error]', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}