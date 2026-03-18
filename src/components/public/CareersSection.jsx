// src/components/public/CareersSection.jsx
'use client';
import { useEffect, useState } from 'react';
import { MapPin, Clock, Briefcase, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const typeColors = {
  'full-time': 'bg-teal-50 text-teal-700',
  'part-time': 'bg-purple-50 text-purple-700',
  'internship': 'bg-amber-50 text-amber-700',
  'contract': 'bg-slate-100 text-slate-600',
};

const deptColors = {
  Engineering: 'bg-brand-50 text-brand-700',
  Design: 'bg-pink-50 text-pink-700',
  Sales: 'bg-green-50 text-green-700',
  Marketing: 'bg-orange-50 text-orange-700',
  Infrastructure: 'bg-indigo-50 text-indigo-700',
};

export default function CareersSection() {
  const [jobs, setJobs] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('professional');
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs?isInternship=false').then(r => r.json()),
      fetch('/api/jobs?isInternship=true').then(r => r.json()),
    ]).then(([prof, int]) => {
      setJobs(prof.jobs || []);
      setInterns(int.jobs || []);
      setLoading(false);
    });
  }, []);

  const displayed = tab === 'professional' ? jobs : interns;

  return (
    <section id="careers" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label mb-4">We're Hiring</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">
            Join the Team That
            <span className="gradient-text block">Builds the Future</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We're a growing company looking for people who love solving hard problems and building things that last. 
            Whether you're a seasoned professional or a student looking for your first real-world experience — there's a place for you here.
          </p>
        </div>

        {/* Culture chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['Remote-friendly', 'Learning & Growth', 'Real Client Impact', 'Equity Programs', 'Flexible Hours', 'Health Benefits'].map(c => (
            <span key={c} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600">
              ✦ {c}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 max-w-sm mx-auto mb-8">
          <button
            onClick={() => setTab('professional')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'professional' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Briefcase size={14} /> Professional
          </button>
          <button
            onClick={() => setTab('internship')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'internship' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            <GraduationCap size={14} /> Internships
          </button>
        </div>

        {/* Internship banner */}
        {tab === 'internship' && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Student-Friendly Internships</p>
              <p className="text-xs text-amber-700 mt-0.5">
                3–6 month programs with real project ownership, mentorship from senior engineers, and a possibility of a full-time offer. 
                Stipend provided. College credit arrangements available upon request.
              </p>
            </div>
          </div>
        )}

        {/* Job cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {displayed.map(job => (
              <div
                key={job.id}
                className="card p-5 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${deptColors[job.department] || 'bg-slate-100 text-slate-600'}`}>
                        {job.department}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${typeColors[job.type] || typeColors['full-time']}`}>
                        {job.type}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-lg leading-tight">{job.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{job.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{job.type}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(job.skills || []).slice(0, 4).map(s => (
                    <span key={s} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100">
                      {s}
                    </span>
                  ))}
                  {(job.skills || []).length > 4 && (
                    <span className="text-[10px] font-medium bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full border border-slate-100">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/apply/${job.id}`)}
                  className="flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:gap-3 transition-all"
                >
                  Apply Now <ArrowRight size={14} />
                </button>
              </div>
            ))}

            {displayed.length === 0 && (
              <div className="col-span-2 text-center py-16 text-slate-400">
                <p className="text-lg font-medium">No openings at the moment.</p>
                <p className="text-sm mt-1">Check back soon or send us your profile at <a href="mailto:careers@aethersolve.com" className="text-brand-500">careers@aethersolve.com</a></p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
