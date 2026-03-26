'use client';
// src/app/company/blog/BlogClient.jsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/public/PageLayout';
import { ArrowRight, Clock, Linkedin, BookOpen, Search } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors = {
  Engineering: 'bg-brand-50 text-brand-700',
  AI:          'bg-emerald-50 text-emerald-700',
  Mobile:      'bg-purple-50 text-purple-700',
  DevOps:      'bg-cyan-50 text-cyan-700',
  Design:      'bg-pink-50 text-pink-700',
  Product:     'bg-amber-50 text-amber-700',
  Business:    'bg-slate-100 text-slate-600',
};

const sourceIcon = {
  linkedin: <Linkedin size={11} className="text-blue-600" />,
  internal: <BookOpen size={11} className="text-brand-600" />,
};

export default function BlogClient() {
  const [posts, setPosts]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState('all');
  const [search, setSearch]       = useState('');
  const [email, setEmail]         = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const categories = ['all', 'Engineering', 'AI', 'Mobile', 'DevOps', 'Design', 'Product', 'Business'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '20' });
    if (category !== 'all') params.set('category', category);
    fetch(`/api/blog?${params}`)
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setTotal(d.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered[0];
  const rest     = filtered.slice(1);

  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'Blog' }]}
      badge="✍️ Blog"
      title="Insights From the Engineers Building the Future"
      subtitle="Engineering decisions, AI experiments, product lessons, and observations from building software for businesses across India."
      heroColor="#006ec7"
    >
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input-field pl-9 text-sm"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize border ${
                category === c
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-slate-200 mx-auto mb-4" />
          <h3 className="font-display font-bold text-slate-700 text-xl mb-2">No posts yet</h3>
          <p className="text-slate-400 text-sm">
            {category !== 'all'
              ? `No ${category} articles published yet. Check back soon!`
              : 'Articles are being written. Check back soon!'}
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
              <div className="h-5 bg-slate-200 rounded w-full mb-2" />
              <div className="h-5 bg-slate-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* Featured post */}
      {!loading && featured && (
        <div className="mb-10">
          <Link href={`/blog/${featured.slug}`}>
            <div className="card p-0 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer grid lg:grid-cols-2">
              {/* Cover image or gradient */}
              <div className="relative h-52 lg:h-auto min-h-[240px] overflow-hidden">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600 to-teal-500 flex items-center justify-center">
                    <BookOpen size={48} className="text-white/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                  {sourceIcon[featured.source]}
                  {featured.source === 'linkedin' ? 'From LinkedIn' : 'Original Article'}
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[featured.category] || 'bg-slate-100 text-slate-600'}`}>
                    {featured.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />{featured.readTime} min read
                  </span>
                  <span className="text-[10px] text-slate-300 ml-auto">Featured</span>
                </div>

                <h2 className="font-display font-bold text-slate-900 text-xl lg:text-2xl leading-snug mb-3 group-hover:text-brand-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-700">{featured.author}</div>
                    <div className="text-[10px] text-slate-400">
                      {featured.publishedAt ? format(new Date(featured.publishedAt), 'MMM d, yyyy') : ''}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Post grid */}
      {!loading && rest.length > 0 && (
        <section className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card p-0 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 duration-300 flex flex-col h-full group cursor-pointer">
                  {/* Cover */}
                  {post.coverImage ? (
                    <div className="h-40 overflow-hidden">
                      <img src={post.coverImage} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-2 bg-gradient-to-r from-brand-500 to-teal-400" />
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        {sourceIcon[post.source]}
                        <span className="flex items-center gap-1"><Clock size={9} />{post.readTime} min</span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{post.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <div className="text-[10px] font-semibold text-slate-600">{post.author}</div>
                        <div className="text-[10px] text-slate-400">
                          {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : ''}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* LinkedIn import note */}
      <div className="mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
        <Linkedin size={20} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">Also on LinkedIn</p>
          <p className="text-sm text-slate-500">
            We post case studies, engineering insights, and company updates on our LinkedIn page.
            Admin can import LinkedIn posts directly into this blog from the admin panel.
          </p>
          <a href="https://linkedin.com/company/aethersolve" target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-600 font-semibold hover:underline mt-2 inline-block">
            Follow AetherSolve on LinkedIn →
          </a>
        </div>
      </div>

      {/* Newsletter signup */}
      <section className="bg-slate-50 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
          One email per month. Engineering insights, product lessons, and what we are building.
        </p>
        {subscribed ? (
          <div className="text-teal-600 font-semibold text-sm">✅ You're subscribed! Welcome aboard.</div>
        ) : (
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field flex-1 text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              className="btn-primary text-sm px-5 py-2.5"
              onClick={() => { if (email) setSubscribed(true); }}
            >
              Subscribe
            </button>
          </div>
        )}
      </section>
    </PageLayout>
  );
}