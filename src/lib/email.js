// src/lib/email.js  — Brevo API (no nodemailer)

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL    = process.env.BREVO_FROM_EMAIL || 'noreply@aethersolve.com';
const FROM_NAME     = process.env.BREVO_FROM_NAME  || 'AetherSolve Technologies';
const ADMIN_EMAIL   = process.env.ADMIN_NOTIFY_EMAIL;

// ── Core sender ───────────────────────────────────────────────────────────────
async function sendViaBrevo({ to, toName, subject, html, attachments = [] }) {
  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email: to, name: toName || to }],
    subject,
    htmlContent: html,
  };
  if (attachments.length) payload.attachment = attachments;

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': BREVO_API_KEY },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Shared shell ──────────────────────────────────────────────────────────────
function shell(content) {
  const yr = new Date().getFullYear();
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
body{margin:0;padding:0;background:#f1f5f9;font-family:Helvetica,Arial,sans-serif}
.w{max-width:620px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.h{background:linear-gradient(135deg,#006ec7,#0c8de9 50%,#14b8a6);padding:36px 32px;text-align:center}
.h h1{color:#fff;margin:0;font-size:26px;font-weight:700}
.h p{color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px}
.b{padding:36px 32px}
.f{background:#f8fafc;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center}
.f p{color:#9ca3af;font-size:12px;margin:3px 0}
h2{color:#0a3f6e;font-size:20px;margin:0 0 14px}
p{color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px}
.box{background:#f0f7ff;border-left:4px solid #0c8de9;border-radius:8px;padding:18px 22px;margin:20px 0}
.box p{margin:0;font-size:14px;color:#0a3f6e}
table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:9px 12px;font-size:14px;border-bottom:1px solid #f1f5f9;color:#374151}
td:first-child{font-weight:600;color:#0a3f6e;width:38%}
.tag{display:inline-block;background:#e0effe;color:#006ec7;font-size:12px;font-weight:600;padding:2px 10px;border-radius:20px}
.btn{display:inline-block;padding:12px 28px;background:#006ec7;color:#fff!important;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;margin:8px 0}
</style></head><body>
<div class="w">
<div class="h"><h1>AetherSolve Technologies</h1><p>Building Tomorrow's Solutions Today</p></div>
<div class="b">${content}</div>
<div class="f">
<p>&copy; ${yr} AetherSolve Technologies Pvt. Ltd. All rights reserved.</p>
<p>Bengaluru, Karnataka, India &middot; hello@aethersolve.com</p>
</div></div></body></html>`;
}

// ── 1. Admin notification on new application ──────────────────────────────────
export async function sendAdminNotification(application, job) {
  const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/applications/${application.id}`;
  const isIntern = application.isIntern;

  const rows = [
    ['Full Name',   `${application.firstName} ${application.lastName}`],
    ['Email',       application.email],
    ['Phone',       application.phone],
    ['Applied For', job.title],
    ['Department',  job.department],
    ['Type',        isIntern ? 'Internship' : 'Professional'],
    ...(isIntern ? [
      ['College',       application.collegeName  || '—'],
      ['Degree',        application.degree        || '—'],
      ['Semester/Year', application.yearOfStudy   || '—'],
      ['CGPA',          application.cgpa          || '—'],
      ['Graduation',    application.graduationYear|| '—'],
    ] : [
      ['Current Role', application.currentRole    || '—'],
      ['Company',      application.previousCompany|| '—'],
      ['Experience',   application.experienceYears ? `${application.experienceYears} yrs` : '—'],
    ]),
    ['Skills', (application.skills||[]).join(', ')||'—'],
    ...(application.resumeUrl   ? [['Resume',    `<a href="${application.resumeUrl}"   style="color:#006ec7">View / Download</a>`]] : []),
    ...(application.portfolioUrl? [['Portfolio', `<a href="${application.portfolioUrl}" style="color:#006ec7">Open Link</a>`]]      : []),
    ...(application.linkedinUrl ? [['LinkedIn',  `<a href="${application.linkedinUrl}"  style="color:#006ec7">View Profile</a>`]]   : []),
  ];
  const tableHtml = rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('');

  const content = `
<h2>&#128236; New Application Received</h2>
<p>A new <span class="tag">${isIntern?'Internship':'Professional'}</span> application for <strong>${job.title}</strong>.</p>
<table>${tableHtml}</table>
${application.coverLetter?`<div class="box"><p><strong>Cover Letter:</strong><br><br>${application.coverLetter.replace(/\n/g,'<br>')}</p></div>`:''}
<p style="margin-top:24px;text-align:center"><a href="${appUrl}" class="btn">Review in Admin Panel &rarr;</a></p>
<p style="font-size:13px;color:#9ca3af;text-align:center">Login at <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/login" style="color:#006ec7">${process.env.NEXT_PUBLIC_APP_URL}/admin/login</a></p>`;

  return sendViaBrevo({
    to: ADMIN_EMAIL,
    toName: 'AetherSolve Admin',
    subject: `[New Application] ${application.firstName} ${application.lastName} \u2192 ${job.title}`,
    html: shell(content),
  });
}

// ── 2. Applicant acknowledgement ──────────────────────────────────────────────
export async function sendApplicationAcknowledgement(application, job) {
  const date = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const content = `
<h2>We've received your application! &#128588;</h2>
<p>Hi <strong>${application.firstName}</strong>,</p>
<p>Thank you for applying for <strong>${job.title}</strong> at AetherSolve Technologies!</p>
<div class="box"><p><strong>Application Summary</strong><br><br>
Position: ${job.title}<br>Department: ${job.department}<br>Applied on: ${date}</p></div>
<p>Our team will review your profile and get back to you within <strong>5&ndash;7 business days</strong>.</p>
<p>Warm regards,<br><strong>AetherSolve Careers Team</strong></p>`;

  return sendViaBrevo({
    to: application.email,
    toName: `${application.firstName} ${application.lastName}`,
    subject: `Application Received \u2014 ${job.title} at AetherSolve Technologies`,
    html: shell(content),
  });
}

// ── 3. Decline email ──────────────────────────────────────────────────────────
export async function sendDeclineEmail({ to, firstName, jobTitle }) {
  const content = `
<h2>Dear ${firstName},</h2>
<p>Thank you sincerely for applying for <strong>${jobTitle}</strong> at AetherSolve Technologies.</p>
<p>After careful consideration we have decided to move forward with other candidates whose experience more closely matches our current requirements. This was a genuinely difficult decision &mdash; yours was a strong application.</p>
<div class="box"><p>We warmly encourage you to keep an eye on our <a href="${process.env.NEXT_PUBLIC_APP_URL}/#careers" style="color:#006ec7">careers page</a> &mdash; new roles open frequently.</p></div>
<p>We wish you the very best ahead.</p>
<p>Warm regards,<br><strong>AetherSolve Careers Team</strong></p>`;

  return sendViaBrevo({
    to, toName: firstName,
    subject: `Regarding Your Application \u2014 ${jobTitle} at AetherSolve Technologies`,
    html: shell(content),
  });
}

// ── 4. Approval email with offer letter attachment ────────────────────────────
export async function sendApprovalEmail({ application, job }) {
  const offerHtml = application.isIntern
    ? generateInternshipOffer(application, job)
    : generateEmployeeOffer(application, job);

  const offerBase64 = Buffer.from(offerHtml).toString('base64');
  const label = application.isIntern ? 'Internship_Offer_Letter' : 'Offer_Letter';
  const fileName = `AetherSolve_${label}_${application.firstName}.html`;

  const content = `
<h2>Congratulations, ${application.firstName}! &#127881;</h2>
<p>We are thrilled to offer you the position of <strong>${job.title}</strong> at AetherSolve Technologies!</p>
<div class="box"><p><strong>&#128206; Offer Letter Attached</strong><br><br>
Please find your offer letter attached. Kindly review and revert with acceptance within <strong>3 working days</strong>.</p></div>
<p><strong>Next Steps:</strong></p>
<table>
<tr><td>1</td><td>Review the attached offer letter</td></tr>
<tr><td>2</td><td>Reply to this email with your signed copy</td></tr>
<tr><td>3</td><td>HR will contact you with onboarding details within 2&ndash;3 business days</td></tr>
</table>
<p>Questions? Write to <a href="mailto:careers@aethersolve.com" style="color:#006ec7">careers@aethersolve.com</a></p>
<p>Welcome to the AetherSolve family!</p>
<p>Warm regards,<br><strong>AetherSolve Careers Team</strong></p>`;

  return sendViaBrevo({
    to: application.email,
    toName: `${application.firstName} ${application.lastName}`,
    subject: `\uD83C\uDF89 Offer Letter \u2014 ${job.title} at AetherSolve Technologies`,
    html: shell(content),
    attachments: [{ name: fileName, content: offerBase64 }],
  });
}

// ── 5. Employee Offer Letter ──────────────────────────────────────────────────
function generateEmployeeOffer(application, job) {
  const fullName   = `${application.firstName} ${application.lastName}`;
  const today      = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const joining    = new Date(Date.now()+14*864e5).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const ref        = `AST/HR/OL/${new Date().getFullYear()}/${Math.floor(Math.random()*9000)+1000}`;
  const sigUrl     = `${process.env.NEXT_PUBLIC_APP_URL}/signature.png`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,'Times New Roman',serif;background:#fff;color:#1a1a1a;font-size:15px;line-height:1.8}
.page{max-width:760px;margin:0 auto;padding:60px 70px}
.lh{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #006ec7;padding-bottom:24px;margin-bottom:32px}
.cn{font-family:Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;color:#006ec7}
.cs{font-size:11px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;margin-top:3px}
.cc{text-align:right;font-size:12px;color:#64748b;line-height:1.8}
.badge{background:#fef3c7;border:1px solid #fde68a;color:#92400e;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:6px 16px;border-radius:4px;display:inline-block;margin-bottom:28px}
.dr{margin-bottom:28px;font-size:14px;color:#374151}
.dr p{margin-bottom:4px}
.sub{font-size:16px;font-weight:700;text-decoration:underline;margin-bottom:20px;color:#0a3f6e}
.bt{margin-bottom:18px;text-align:justify}
table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14px}
th{background:#006ec7;color:#fff;padding:10px 14px;text-align:left;font-size:13px}
td{padding:10px 14px;border-bottom:1px solid #e5e7eb;vertical-align:top}
tr:nth-child(even) td{background:#f8fafc}
td:first-child{font-weight:600;color:#0a3f6e;width:35%}
.ss{margin-top:48px;display:flex;justify-content:space-between;align-items:flex-end}
.sl{border-top:1px solid #1a1a1a;width:220px;padding-top:8px;font-size:13px}
.sig{height:64px;display:block;margin-bottom:4px;object-fit:contain}
.acc{margin-top:40px;border:2px dashed #006ec7;border-radius:8px;padding:20px 24px;background:#f0f7ff}
.acc p{font-size:13px;color:#374151;margin-bottom:12px}
.fn{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;line-height:1.8}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><div class="page">
<div class="lh">
  <div><div class="cn">AetherSolve Technologies</div><div class="cs">Building Tomorrow's Solutions Today</div></div>
  <div class="cc">hello@aethersolve.com<br>+91 88000 00000<br>Bengaluru, Karnataka &mdash; 560001<br>www.aethersolve.com</div>
</div>
<div class="badge">Confidential</div>
<div class="dr"><p><strong>Date:</strong> ${today}</p><p><strong>Ref:</strong> ${ref}</p></div>
<div style="font-size:16px;margin-bottom:20px"><strong>${fullName}</strong><br>${application.email}<br>${application.phone}</div>
<div class="sub">Subject: Letter of Appointment &mdash; ${job.title} (${job.department})</div>
<p class="bt">Dear <strong>${application.firstName}</strong>,</p>
<p class="bt">We are delighted to extend this offer of employment for the position of <strong>${job.title}</strong> in the <strong>${job.department}</strong> department at <strong>AetherSolve Technologies Pvt. Ltd.</strong></p>
<table>
<tr><th colspan="2">Terms of Employment</th></tr>
<tr><td>Designation</td><td>${job.title}</td></tr>
<tr><td>Department</td><td>${job.department}</td></tr>
<tr><td>Employment Type</td><td>Full-Time, Permanent</td></tr>
<tr><td>Location</td><td>${job.location||'Bengaluru, Karnataka (Hybrid)'}</td></tr>
<tr><td>Date of Joining</td><td>${joining} (or as mutually agreed)</td></tr>
<tr><td>Probation Period</td><td>3 months from date of joining</td></tr>
<tr><td>Working Hours</td><td>Monday to Friday, 9:30 AM &ndash; 6:30 PM IST</td></tr>
<tr><td>Compensation</td><td>As communicated during interview (CTC in annexure)</td></tr>
<tr><td>Leave Entitlement</td><td>18 days paid leave + 12 public holidays per annum</td></tr>
<tr><td>Notice Period</td><td>1 month (probation) / 2 months (post-confirmation)</td></tr>
</table>
<p class="bt">This offer is contingent upon satisfactory verification of your educational qualifications, employment records, and background checks.</p>
<p class="bt">Kindly sign and return a copy within <strong>3 working days</strong>. Queries: <a href="mailto:careers@aethersolve.com" style="color:#006ec7">careers@aethersolve.com</a></p>
<p class="bt">We look forward to welcoming you to the AetherSolve family!</p>
<div class="ss">
  <div>
    <p style="font-size:13px;color:#374151;margin-bottom:8px">For AetherSolve Technologies Pvt. Ltd.</p>
    <img src="${sigUrl}" alt="Signature" class="sig" onerror="this.style.display='none'"/>
    <div class="sl">Authorised Signatory<br><span style="color:#006ec7;font-weight:700">AetherSolve Technologies</span></div>
  </div>
  <div style="font-size:12px;color:#9ca3af;text-align:right">Official Seal<br>
    <div style="width:90px;height:90px;border:1.5px solid #e5e7eb;border-radius:50%;margin-top:8px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;color:#cbd5e1;margin-left:auto">AetherSolve<br>Technologies</div>
  </div>
</div>
<div class="acc">
  <p><strong>Acceptance of Offer</strong></p>
  <p>I, <strong>${fullName}</strong>, hereby accept the offer of employment as <strong>${job.title}</strong> at AetherSolve Technologies Pvt. Ltd. on the terms stated above.</p>
  <div style="display:flex;gap:48px;margin-top:24px">
    <div><div class="sl" style="width:200px">Signature of Candidate</div></div>
    <div><div class="sl" style="width:160px">Date</div></div>
  </div>
</div>
<div class="fn">AetherSolve Technologies Pvt. Ltd. &middot; Bengaluru, Karnataka &ndash; 560001<br>This document is computer-generated and constitutes a valid offer letter.</div>
</div></body></html>`;
}

// ── 6. Internship Offer Letter ────────────────────────────────────────────────
function generateInternshipOffer(application, job) {
  const fullName   = `${application.firstName} ${application.lastName}`;
  const today      = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const start      = new Date(Date.now()+7*864e5).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const end        = new Date(Date.now()+97*864e5).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const ref        = `AST/HR/INT/${new Date().getFullYear()}/${Math.floor(Math.random()*9000)+1000}`;
  const sigUrl     = `${process.env.NEXT_PUBLIC_APP_URL}/signature.png`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,'Times New Roman',serif;background:#fff;color:#1a1a1a;font-size:15px;line-height:1.8}
.page{max-width:760px;margin:0 auto;padding:60px 70px}
.lh{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0d9488;padding-bottom:24px;margin-bottom:32px}
.cn{font-family:Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;color:#0d9488}
.cs{font-size:11px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;margin-top:3px}
.cc{text-align:right;font-size:12px;color:#64748b;line-height:1.8}
.badge{background:#f0fdfa;border:1px solid #99f6e4;color:#0f766e;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:6px 16px;border-radius:4px;display:inline-block;margin-bottom:28px}
.dr{margin-bottom:28px;font-size:14px;color:#374151}.dr p{margin-bottom:4px}
.sub{font-size:16px;font-weight:700;text-decoration:underline;margin-bottom:20px;color:#0f766e}
.bt{margin-bottom:18px;text-align:justify}
table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14px}
th{background:#0d9488;color:#fff;padding:10px 14px;text-align:left;font-size:13px}
td{padding:10px 14px;border-bottom:1px solid #e5e7eb;vertical-align:top}
tr:nth-child(even) td{background:#f0fdfa}
td:first-child{font-weight:600;color:#0f766e;width:35%}
.hbox{background:#f0fdfa;border-left:4px solid #0d9488;border-radius:8px;padding:18px 22px;margin:20px 0}
.hbox p{font-size:14px;color:#134e4a}
.ss{margin-top:48px;display:flex;justify-content:space-between;align-items:flex-end}
.sl{border-top:1px solid #1a1a1a;width:220px;padding-top:8px;font-size:13px}
.sig{height:64px;display:block;margin-bottom:4px;object-fit:contain}
.acc{margin-top:40px;border:2px dashed #0d9488;border-radius:8px;padding:20px 24px;background:#f0fdfa}
.acc p{font-size:13px;color:#374151;margin-bottom:12px}
.fn{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;text-align:center;line-height:1.8}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><div class="page">
<div class="lh">
  <div><div class="cn">AetherSolve Technologies</div><div class="cs">Building Tomorrow's Solutions Today</div></div>
  <div class="cc">hello@aethersolve.com<br>+91 88000 00000<br>Bengaluru, Karnataka &mdash; 560001<br>www.aethersolve.com</div>
</div>
<div class="badge">Internship Offer Letter</div>
<div class="dr"><p><strong>Date:</strong> ${today}</p><p><strong>Ref:</strong> ${ref}</p></div>
<div style="font-size:16px;margin-bottom:20px">
  <strong>${fullName}</strong><br>
  ${application.collegeName||'Institution'} &mdash; ${application.degree||''} ${application.yearOfStudy||''}<br>
  ${application.email}<br>${application.phone}
</div>
<div class="sub">Subject: Internship Offer &mdash; ${job.title} Intern (${job.department})</div>
<p class="bt">Dear <strong>${application.firstName}</strong>,</p>
<p class="bt">We are pleased to offer you an internship as <strong>${job.title} Intern</strong> in our <strong>${job.department}</strong> team at AetherSolve Technologies Pvt. Ltd.</p>
<table>
<tr><th colspan="2">Internship Terms</th></tr>
<tr><td>Role</td><td>${job.title} Intern</td></tr>
<tr><td>Department</td><td>${job.department}</td></tr>
<tr><td>Mode</td><td>${job.location||'Hybrid (Remote + On-site)'}</td></tr>
<tr><td>Duration</td><td>3 Months (extendable based on performance)</td></tr>
<tr><td>Start Date</td><td>${start} (or as mutually agreed)</td></tr>
<tr><td>End Date (tentative)</td><td>${end}</td></tr>
<tr><td>Working Hours</td><td>Monday to Friday, flexible (min. 6 hrs/day)</td></tr>
<tr><td>Stipend</td><td>As communicated during interview</td></tr>
<tr><td>College</td><td>${application.collegeName||'&mdash;'}</td></tr>
<tr><td>Degree / Semester</td><td>${application.degree||'&mdash;'} &mdash; ${application.yearOfStudy||'&mdash;'}</td></tr>
${application.cgpa?`<tr><td>CGPA</td><td>${application.cgpa}</td></tr>`:''}
</table>
<div class="hbox"><p><strong>What You Will Gain</strong><br><br>
&#10004; Real project ownership on live client deliverables<br>
&#10004; Mentorship from senior engineers and designers<br>
&#10004; Official internship completion certificate<br>
&#10004; LinkedIn recommendation upon successful completion<br>
&#10004; Priority consideration for full-time roles based on performance</p></div>
<p class="bt">Upon successful completion, AetherSolve will issue an <strong>Internship Completion Certificate</strong> and <strong>Letter of Recommendation</strong>.</p>
<p class="bt">Kindly sign and return within <strong>3 working days</strong>. Queries: <a href="mailto:careers@aethersolve.com" style="color:#0d9488">careers@aethersolve.com</a></p>
<p class="bt">We look forward to a productive internship experience!</p>
<div class="ss">
  <div>
    <p style="font-size:13px;color:#374151;margin-bottom:8px">For AetherSolve Technologies Pvt. Ltd.</p>
    <img src="${sigUrl}" alt="Signature" class="sig" onerror="this.style.display='none'"/>
    <div class="sl">Authorised Signatory<br><span style="color:#0d9488;font-weight:700">AetherSolve Technologies</span></div>
  </div>
  <div style="font-size:12px;color:#9ca3af;text-align:right">Official Seal<br>
    <div style="width:90px;height:90px;border:1.5px solid #e5e7eb;border-radius:50%;margin-top:8px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;color:#cbd5e1;margin-left:auto">AetherSolve<br>Technologies</div>
  </div>
</div>
<div class="acc">
  <p><strong>Acceptance of Internship Offer</strong></p>
  <p>I, <strong>${fullName}</strong>, student of <strong>${application.collegeName||'___________'}</strong>, hereby accept the internship offer for <strong>${job.title} Intern</strong> at AetherSolve Technologies Pvt. Ltd.</p>
  <div style="display:flex;gap:48px;margin-top:24px">
    <div><div class="sl" style="width:200px">Signature of Intern</div></div>
    <div><div class="sl" style="width:160px">Date</div></div>
  </div>
</div>
<div class="fn">AetherSolve Technologies Pvt. Ltd. &middot; Bengaluru, Karnataka &ndash; 560001<br>careers@aethersolve.com</div>
</div></body></html>`;
}