// src/app/apply/[jobId]/page.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Upload, CheckCircle, Loader2, Zap,
  User, Briefcase, GraduationCap, Link2, FileText, HardDrive
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResume } from '@/lib/supabase';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function ApplyPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { send } = useWebSocket('public');
  const fileRef = useRef(null);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    currentRole: '', previousCompany: '', skills: '', experienceYears: '',
    linkedinUrl: '', portfolioUrl: '', driveResumeUrl: '', coverLetter: '',
    collegeName: '', degree: '', yearOfStudy: '', cgpa: '', graduationYear: '',
  });

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then(r => r.json())
      .then(d => { setJob(d.job); setLoading(false); })
      .catch(() => router.push('/'));
  }, [jobId]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) { toast.error('Only PDF, DOC, DOCX accepted'); return; }
    setResumeFile(file);
    toast.success(`${file.name} selected`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // Step 3 submit — only called when Submit button is explicitly clicked
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error('Please fill required personal details'); setStep(1); return;
    }

    setSubmitting(true);
    try {
      let resumeUrl = null;
      if (resumeFile) {
        try {
          const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          resumeUrl = await uploadResume(resumeFile, tempId);
        } catch (uploadErr) {
          console.error('Upload failed, continuing without file:', uploadErr);
          toast('Resume upload failed — application saved without file attachment', { icon: '⚠️' });
        }
      }

      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          ...form,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null,
          isIntern: job?.isInternship || false,
          resumeUrl,
          driveResumeUrl: form.driveResumeUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      send('new_application', {
        applicant: `${form.firstName} ${form.lastName}`,
        job: job?.title,
        email: form.email,
        id: data.application?.id,
        isIntern: job?.isInternship,
      });

      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone) {
        toast.error('Please fill all required fields'); return;
      }
    }
    setStep(s => s + 1);
  };

  const goBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStep(s => s - 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 size={32} className="text-brand-500 animate-spin" />
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md animate-fade-up">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-teal-500" />
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
        <p className="text-slate-500 mb-2">
          Thank you, <span className="font-semibold text-slate-700">{form.firstName}</span>!
          Your application for <span className="font-semibold text-brand-600">{job?.title}</span> has been received.
        </p>
        <p className="text-sm text-slate-400 mb-8">
          We'll review your profile and reach out to <span className="font-medium">{form.email}</span> within 5–7 business days.
        </p>
        <button onClick={() => router.push('/')} className="btn-primary">Back to AetherSolve</button>
      </div>
    </div>
  );

  const steps = [
    { n: 1, label: 'Personal Info' },
    { n: 2, label: job?.isInternship ? 'Academic Info' : 'Professional' },
    { n: 3, label: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button type="button" onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-slate-800">AetherSolve</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="text-sm text-slate-500">Application Form</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Job info card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
              {job?.isInternship
                ? <GraduationCap size={20} className="text-brand-600" />
                : <Briefcase size={20} className="text-brand-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full">{job?.department}</span>
                {job?.isInternship && <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full">Internship</span>}
              </div>
              <h1 className="font-display font-bold text-lg text-slate-900">{job?.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{job?.location} · {job?.type}</p>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > n ? 'bg-teal-500 text-white' : step === n ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > n ? '✓' : n}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step === n ? 'text-brand-600' : 'text-slate-400'}`}>{label}</span>
              </div>
              {i < 2 && <div className={`h-px flex-1 ${step > n ? 'bg-teal-300' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* IMPORTANT: no <form> wrapping the whole thing — only wraps the current step's content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* ── Step 1: Personal ── */}
          {step === 1 && (
            <div className="p-6 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-brand-500" />
                <h2 className="font-display font-bold text-lg text-slate-800">Personal Information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name <span className="text-red-400">*</span></label>
                  <input className="input-field" placeholder="Rahul" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name <span className="text-red-400">*</span></label>
                  <input className="input-field" placeholder="Sharma" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                <input className="input-field" type="email" placeholder="rahul@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                <input className="input-field" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>

              <div className="pt-2 flex justify-end border-t border-slate-100 mt-4">
                <button type="button" onClick={goNext} className="btn-primary text-sm px-6 py-2.5">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Professional / Academic ── */}
          {step === 2 && (
            <div className="p-6 space-y-5 animate-fade-in">
              {job?.isInternship ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={16} className="text-amber-500" />
                    <h2 className="font-display font-bold text-lg text-slate-800">Academic Information</h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">College / University <span className="text-red-400">*</span></label>
                    <input className="input-field" placeholder="IIT Bombay / VIT / BITS Pilani..." value={form.collegeName} onChange={e => set('collegeName', e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree / Program</label>
                      <select className="input-field" value={form.degree} onChange={e => set('degree', e.target.value)}>
                        <option value="">Select degree...</option>
                        <option>B.Tech / B.E.</option>
                        <option>BCA</option>
                        <option>MCA</option>
                        <option>M.Tech</option>
                        <option>MBA</option>
                        <option>BBA</option>
                        <option>B.Sc. CS/IT</option>
                        <option>B.Des / M.Des</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Year / Semester</label>
                      <select className="input-field" value={form.yearOfStudy} onChange={e => set('yearOfStudy', e.target.value)}>
                        <option value="">Select...</option>
                        <option>1st Year / Sem 1</option>
                        <option>1st Year / Sem 2</option>
                        <option>2nd Year / Sem 3</option>
                        <option>2nd Year / Sem 4</option>
                        <option>3rd Year / Sem 5</option>
                        <option>3rd Year / Sem 6</option>
                        <option>4th Year / Sem 7</option>
                        <option>4th Year / Sem 8</option>
                        <option>Final Semester</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">CGPA / Percentage</label>
                      <input className="input-field" placeholder="e.g. 8.5 / 85%" value={form.cgpa} onChange={e => set('cgpa', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Graduation Year</label>
                      <select className="input-field" value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)}>
                        <option value="">Select year...</option>
                        {[2025, 2026, 2027, 2028, 2029].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Skills <span className="text-xs text-slate-400">(comma-separated)</span></label>
                    <input className="input-field" placeholder="React, Node.js, Python, Figma..." value={form.skills} onChange={e => set('skills', e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={16} className="text-brand-500" />
                    <h2 className="font-display font-bold text-lg text-slate-800">Professional Background</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Role</label>
                      <input className="input-field" placeholder="Senior Software Engineer" value={form.currentRole} onChange={e => set('currentRole', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Current / Previous Company</label>
                      <input className="input-field" placeholder="Infosys, TCS, Startup..." value={form.previousCompany} onChange={e => set('previousCompany', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Years of Experience</label>
                    <select className="input-field" value={form.experienceYears} onChange={e => set('experienceYears', e.target.value)}>
                      <option value="">Select...</option>
                      {['0–1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map(y => (
                        <option key={y} value={y}>{y} year{y !== '1' ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Key Skills <span className="text-xs text-slate-400">(comma-separated)</span></label>
                    <input className="input-field" placeholder="React, Node.js, AWS, PostgreSQL..." value={form.skills} onChange={e => set('skills', e.target.value)} />
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-4">
                <button type="button" onClick={goBack} className="btn-ghost text-sm">← Back</button>
                <button type="button" onClick={goNext} className="btn-primary text-sm px-6 py-2.5">Continue →</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Documents — standalone form with explicit submit ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-brand-500" />
                <h2 className="font-display font-bold text-lg text-slate-800">Documents & Links</h2>
              </div>

              {/* Resume file upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Resume / CV
                  <span className="text-xs text-slate-400 font-normal ml-2">(PDF, DOC, DOCX — max 5MB)</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragging
                      ? 'border-brand-400 bg-brand-50'
                      : resumeFile
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50'
                  }`}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                  />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle size={20} className="text-teal-500" />
                      <div>
                        <p className="text-sm font-semibold text-teal-700">{resumeFile.name}</p>
                        <p className="text-xs text-teal-500">{(resumeFile.size / 1024).toFixed(0)} KB — Click to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-600">Drop your resume here or <span className="text-brand-600">browse files</span></p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX supported</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Google Drive resume link */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <HardDrive size={13} className="inline mr-1.5 text-slate-400" />
                  Google Drive Resume Link
                  <span className="text-xs text-slate-400 font-normal ml-2">(optional — if file upload fails)</span>
                </label>
                <input
                  className="input-field"
                  placeholder="https://drive.google.com/file/d/..."
                  value={form.driveResumeUrl}
                  onChange={e => set('driveResumeUrl', e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <Link2 size={13} className="inline mr-1.5 text-slate-400" />
                    LinkedIn Profile
                  </label>
                  <input
                    className="input-field"
                    placeholder="linkedin.com/in/yourname"
                    value={form.linkedinUrl}
                    onChange={e => set('linkedinUrl', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <Link2 size={13} className="inline mr-1.5 text-slate-400" />
                    Portfolio / GitHub
                  </label>
                  <input
                    className="input-field"
                    placeholder="github.com/yourname"
                    value={form.portfolioUrl}
                    onChange={e => set('portfolioUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cover Letter
                  <span className="text-xs text-slate-400 font-normal ml-2">(optional but recommended)</span>
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Tell us why you want to join AetherSolve and what makes you a great fit..."
                  value={form.coverLetter}
                  onChange={e => set('coverLetter', e.target.value)}
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button type="button" onClick={goBack} className="btn-ghost text-sm">← Back</button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-sm px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    : <><CheckCircle size={16} /> Submit Application</>
                  }
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}