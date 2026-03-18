// src/app/admin/applications/[id]/page.js
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, Briefcase, Link2, FileText,
  CheckCircle, XCircle, Clock, Loader2, ExternalLink,
  GraduationCap, MessageSquare, Send
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  reviewing: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  approved:  { color: 'bg-teal-50 text-teal-700 border-teal-200', icon: CheckCircle },
  declined:  { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [sendingEmail, setSendingEmail] = useState(null);

  useEffect(() => {
    fetch(`/api/applications/${id}`)
      .then(r => r.json())
      .then(d => {
        setApp(d.application);
        setNotes(d.application?.adminNotes || '');
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (status, sendEmail = false) => {
    setSendingEmail(status);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes, sendEmail }),
      });
      const d = await res.json();
      setApp(d.application);
      toast.success(sendEmail ? `Status updated & email sent to applicant!` : 'Status updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSendingEmail(null);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: app.status, adminNotes: notes }),
    });
    toast.success('Notes saved');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={28} className="animate-spin text-brand-500" />
    </div>
  );

  if (!app) return <div className="text-center py-24 text-slate-400">Application not found</div>;

  const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-slate-200 transition-colors">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-slate-900">
            {app.firstName} {app.lastName}
          </h1>
          <p className="text-slate-500 text-sm">{app.job?.title} · {app.job?.department}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border capitalize ${statusCfg.color}`}>
          <StatusIcon size={13} />
          {app.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — applicant info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="admin-card">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">Contact Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={app.email} link={`mailto:${app.email}`} />
              <InfoRow icon={Phone} label="Phone" value={app.phone} link={`tel:${app.phone}`} />
              {app.linkedinUrl && <InfoRow icon={Link2} label="LinkedIn" value="View Profile" link={app.linkedinUrl} external />}
              {app.portfolioUrl && <InfoRow icon={ExternalLink} label="Portfolio" value="View Portfolio" link={app.portfolioUrl} external />}
            </div>
          </div>

          {/* Professional / Academic */}
          <div className="admin-card">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wider">
              {app.isIntern ? 'Academic Background' : 'Professional Background'}
            </h3>
            {app.isIntern ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={GraduationCap} label="College" value={app.collegeName} />
                <InfoRow icon={GraduationCap} label="Degree" value={app.degree} />
                <InfoRow icon={GraduationCap} label="Year" value={app.yearOfStudy} />
                <InfoRow icon={GraduationCap} label="CGPA" value={app.cgpa} />
                <InfoRow icon={GraduationCap} label="Graduation" value={app.graduationYear} />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoRow icon={Briefcase} label="Current Role" value={app.currentRole} />
                <InfoRow icon={Briefcase} label="Company" value={app.previousCompany} />
                <InfoRow icon={Briefcase} label="Experience" value={app.experienceYears ? `${app.experienceYears} years` : null} />
              </div>
            )}

            {app.skills?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {app.skills.map(s => (
                    <span key={s} className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover letter */}
          {app.coverLetter && (
            <div className="admin-card">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Cover Letter
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
            </div>
          )}

          {/* Resume */}
          {app.resumeUrl && (
            <div className="admin-card">
              <h3 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Resume</h3>
              <a
                href={app.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-100 rounded-xl hover:bg-brand-100 transition-colors"
              >
                <FileText size={18} className="text-brand-600" />
                <span className="text-sm font-semibold text-brand-700">Download / View Resume</span>
                <ExternalLink size={13} className="text-brand-400 ml-auto" />
              </a>
            </div>
          )}
        </div>

        {/* Right — actions */}
        <div className="space-y-5">
          {/* Applied info */}
          <div className="admin-card">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Application Info</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Applied</span>
                <span className="font-medium text-slate-700">{format(new Date(app.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="font-medium text-slate-700">{app.isIntern ? 'Internship' : 'Professional'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Position</span>
                <span className="font-medium text-slate-700 text-right text-xs">{app.job?.title}</span>
              </div>
            </div>
          </div>

          {/* Status actions */}
          <div className="admin-card">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Update Status</p>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus('reviewing')}
                disabled={app.status === 'reviewing'}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Mark as Reviewing
              </button>
              <button
                onClick={() => updateStatus('approved', true)}
                disabled={app.status === 'approved' || sendingEmail === 'approved'}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingEmail === 'approved' ? <Loader2 size={14} className="animate-spin" /> : <><CheckCircle size={14} /> Approve & Send Email</>}
              </button>
              <button
                onClick={() => updateStatus('declined', true)}
                disabled={app.status === 'declined' || sendingEmail === 'declined'}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingEmail === 'declined' ? <Loader2 size={14} className="animate-spin" /> : <><XCircle size={14} /> Decline & Send Email</>}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Approve/Decline will automatically send a professional email to the applicant.
            </p>
          </div>

          {/* Admin notes */}
          <div className="admin-card">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare size={12} /> Internal Notes
            </p>
            <textarea
              className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none bg-slate-50"
              rows={4}
              placeholder="Add notes visible only to admins..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="mt-2 w-full btn-primary text-sm py-2.5 justify-center"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <><Send size={13} /> Save Notes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, link, external }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-slate-500" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        {link ? (
          <a
            href={link}
            target={external ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:underline font-medium"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-slate-700 font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}
