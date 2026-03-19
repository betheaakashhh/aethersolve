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

  const body = await request.json();
  const {
    status, adminNotes, sendEmail,
    // Admin offer fields
    joiningDate, workingHours,
    internStartDate, internEndDate, internWorkHours, stipend,
  } = body;

  // Build update data — only include defined fields
  const updateData = { status };
  if (adminNotes  !== undefined) updateData.adminNotes  = adminNotes;
  if (joiningDate !== undefined) updateData.joiningDate = joiningDate;
  if (workingHours!== undefined) updateData.workingHours= workingHours;
  if (internStartDate !== undefined) updateData.internStartDate = internStartDate;
  if (internEndDate   !== undefined) updateData.internEndDate   = internEndDate;
  if (internWorkHours !== undefined) updateData.internWorkHours = internWorkHours;
  if (stipend     !== undefined) updateData.stipend     = stipend;

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: updateData,
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
        // AUTO-DELETE after decline email sent
        await prisma.application.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true, deleted: true, message: 'Declined & data removed.' });
      }
    } catch (emailErr) {
      console.error('[Email Error]', emailErr);
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