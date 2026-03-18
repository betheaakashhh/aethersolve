// src/app/api/applications/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { sendApprovalEmail, sendDeclineEmail } from '@/lib/email';

export async function GET(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true },
  });
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ application });
}

export async function PATCH(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status, adminNotes, sendEmail } = await request.json();

  // Fetch full application + job for email
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true },
  });
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Update status
  const updated = await prisma.application.update({
    where: { id: params.id },
    data: { status, ...(adminNotes !== undefined && { adminNotes }) },
    include: { job: true },
  });

  if (sendEmail) {
    try {
      if (status === 'approved') {
        await sendApprovalEmail({ application: updated, job: updated.job });
      } else if (status === 'declined') {
        await sendDeclineEmail({
          to:        updated.email,
          firstName: updated.firstName,
          jobTitle:  updated.job.title,
        });
        // AUTO-DELETE applicant data after decline email sent
        await prisma.application.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true, deleted: true, message: 'Application declined and data removed.' });
      }
    } catch (emailErr) {
      console.error('[Email Error]', emailErr);
      // Still return success — email failure shouldn't block status update
      return NextResponse.json({ application: updated, emailError: emailErr.message });
    }
  }

  return NextResponse.json({ application: updated });
}

export async function DELETE(request, { params }) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.application.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}