// src/app/blog/[slug]/page.js
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, Linkedin, BookOpen, Tag } from 'lucide-react';
import { format } from 'date-fns';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.metaTitle || `${post.title} — AetherSolve Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.isPublished) notFound();

  const categoryColors = {
    Engineering: 'bg-brand-50 text-brand-700',
    AI:          'bg-emerald-50 text-emerald-700',
    Mobile:      'bg-purple-50 text-purple-700',
    DevOps:      'bg-cyan-50 text-cyan-700',
    Design:      'bg-pink-50 text-pink-700',
    Product:     'bg-amber-50 text-amber-700',
    Business:    'bg-slate-100 text-slate-600',
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 shrink-0">
              <img src="/newaether.png" alt="AetherSolve" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-bold text-slate-900 text-base">AetherSolve</span>
          </Link>
          <Link href="/company/blog" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={15} /> All Articles
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-500">Home</Link>
          <span>/</span>
          <Link href="/company/blog" className="hover:text-brand-500">Blog</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-xs">{post.title}</span>
        </div>

        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={12} />{post.readTime} min read
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar size={12} />{format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          )}
          {post.source === 'linkedin' && (
            <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-semibold">
              <Linkedin size={10} /> Originally on LinkedIn
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-5">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-slate-500 leading-relaxed mb-8 border-l-4 border-brand-200 pl-5">
          {post.excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
            {post.author[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{post.author}</div>
            {post.authorRole && <div className="text-xs text-slate-400">{post.authorRole}</div>}
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-10 shadow-sm">
            <img src={post.coverImage} alt={post.title} className="w-full h-64 lg:h-80 object-cover" />
          </div>
        )}

        {/* Content — renders markdown-style line breaks */}
        <div className="prose prose-slate max-w-none">
          {post.content.split('\n\n').map((para, i) => {
            if (para.startsWith('## ')) {
              return <h2 key={i} className="font-display text-2xl font-bold text-slate-900 mt-10 mb-4">{para.slice(3)}</h2>;
            }
            if (para.startsWith('### ')) {
              return <h3 key={i} className="font-display text-xl font-bold text-slate-800 mt-8 mb-3">{para.slice(4)}</h3>;
            }
            if (para.startsWith('- ')) {
              const items = para.split('\n').filter(l => l.startsWith('- '));
              return (
                <ul key={i} className="my-4 space-y-2">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-2 shrink-0" />
                      {item.slice(2)}
                    </li>
                  ))}
                </ul>
              );
            }
            if (para.startsWith('> ')) {
              return (
                <blockquote key={i} className="my-6 pl-5 border-l-4 border-brand-300 bg-brand-50 py-3 pr-4 rounded-r-xl">
                  <p className="text-slate-700 italic text-sm leading-relaxed">{para.slice(2)}</p>
                </blockquote>
              );
            }
            return <p key={i} className="text-slate-600 leading-relaxed mb-5 text-sm lg:text-base">{para}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap gap-2 items-center">
            <Tag size={13} className="text-slate-400" />
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* LinkedIn CTA if sourced from LinkedIn */}
        {post.source === 'linkedin' && post.linkedinUrl && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
            <Linkedin size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-1">This article was originally published on LinkedIn</p>
              <a href={post.linkedinUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 font-semibold hover:underline">
                View original post & join the conversation →
              </a>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link href="/company/blog" className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:gap-3 transition-all">
            <ArrowLeft size={14} /> Back to all articles
          </Link>
        </div>
      </article>

      <footer className="bg-slate-900 text-slate-500 py-6 text-center text-xs mt-16">
        © {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd. ·{' '}
        <Link href="/" className="hover:text-slate-300 transition-colors">Back to Home</Link>
      </footer>
    </div>
  );
}