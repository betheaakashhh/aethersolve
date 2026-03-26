'use client';
// src/app/admin/blog/page.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Loader2,
  X, Save, Globe, Linkedin, BookOpen, ExternalLink,
  Clock, Tag, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['Engineering', 'AI', 'Mobile', 'DevOps', 'Design', 'Product', 'Business'];

const STATUS_COLORS = {
  true:  'bg-teal-50 text-teal-700 border-teal-200',
  false: 'bg-amber-50 text-amber-700 border-amber-200',
};

// ── Slug generator ─────────────────────────────────────────────────────────────
function toSlug(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── Blog editor form ───────────────────────────────────────────────────────────
function BlogEditor({ initial, onSave, onCancel }) {
  const isEdit = Boolean(initial?.id);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState({
    title:           initial?.title           || '',
    slug:            initial?.slug            || '',
    excerpt:         initial?.excerpt         || '',
    content:         initial?.content         || '',
    coverImage:      initial?.coverImage      || '',
    category:        initial?.category        || 'Engineering',
    tags:            initial?.tags            || [],
    author:          initial?.author          || 'AetherSolve Team',
    authorRole:      initial?.authorRole      || '',
    source:          initial?.source          || 'internal',
    linkedinUrl:     initial?.linkedinUrl     || '',
    isPublished:     initial?.isPublished     ?? false,
    metaTitle:       initial?.metaTitle       || '',
    metaDescription: initial?.metaDescription || '',
    readTime:        initial?.readTime        || 5,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Auto-generate slug from title
  const handleTitle = (v) => {
    set('title', v);
    if (!isEdit) set('slug', toSlug(v));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      toast.error('Title, slug, excerpt and content are required'); return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-end overflow-hidden">
      <div className="h-full w-full max-w-3xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-brand-500" />
            <h2 className="font-display font-bold text-slate-900">{isEdit ? 'Edit Post' : 'New Blog Post'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-sm py-2 px-4"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={13} /> {isEdit ? 'Update' : 'Save'}</>}
            </button>
            <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Source selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Post Source</label>
            <div className="flex gap-3">
              {[
                { v: 'internal', label: 'Written here', icon: BookOpen },
                { v: 'linkedin', label: 'From LinkedIn', icon: Linkedin },
              ].map(({ v, label, icon: Icon }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('source', v)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    form.source === v
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
            {form.source === 'linkedin' && (
              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">LinkedIn Post URL</label>
                <input
                  className="input-field text-sm"
                  placeholder="https://linkedin.com/posts/..."
                  value={form.linkedinUrl}
                  onChange={e => set('linkedinUrl', e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">Paste the link to the original LinkedIn post — shown at the bottom of the article.</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Title *</label>
            <input
              className="input-field text-sm font-semibold"
              placeholder="Why Custom ERP Beats Off-the-Shelf After 3 Years"
              value={form.title}
              onChange={e => handleTitle(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              URL Slug *
              <span className="text-slate-400 font-normal ml-1">— aethersolve.com/blog/<span className="text-brand-500">{form.slug || 'your-slug'}</span></span>
            </label>
            <input
              className="input-field text-sm font-mono"
              placeholder="why-custom-erp-beats-off-the-shelf"
              value={form.slug}
              onChange={e => set('slug', toSlug(e.target.value))}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Excerpt * <span className="font-normal text-slate-400">(shown on listing page)</span></label>
            <textarea
              className="input-field text-sm resize-none"
              rows={2}
              placeholder="A one or two sentence summary of the article..."
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Content *
              <span className="font-normal text-slate-400 ml-1">— use ## for headings, - for bullets, {'>'} for quotes</span>
            </label>
            <textarea
              className="input-field text-sm resize-none font-mono"
              rows={14}
              placeholder={`## Introduction\n\nWrite your article here. Use markdown-like syntax:\n\n## Section Heading\n\nParagraph text here...\n\n- Bullet point one\n- Bullet point two\n\n> This is a highlighted quote or callout`}
              value={form.content}
              onChange={e => set('content', e.target.value)}
            />
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Cover Image URL <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              className="input-field text-sm"
              placeholder="https://images.unsplash.com/..."
              value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
            />
          </div>

          {/* Category + read time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Category *</label>
              <select className="input-field text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Read Time (minutes)</label>
              <input
                type="number" min="1" max="60"
                className="input-field text-sm"
                value={form.readTime}
                onChange={e => set('readTime', parseInt(e.target.value) || 5)}
              />
            </div>
          </div>

          {/* Author */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Author Name</label>
              <input className="input-field text-sm" placeholder="AetherSolve Team"
                value={form.author} onChange={e => set('author', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Author Role</label>
              <input className="input-field text-sm" placeholder="CTO, AetherSolve"
                value={form.authorRole} onChange={e => set('authorRole', e.target.value)} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100">
                  {t}
                  <button type="button" onClick={() => set('tags', form.tags.filter(x => x !== t))}><X size={9} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field text-sm flex-1"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button type="button" onClick={addTag} className="btn-secondary text-xs px-3 py-2">Add</button>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SEO (optional)</p>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Meta Title</label>
              <input className="input-field text-sm" placeholder="Leave blank to use post title"
                value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Meta Description</label>
              <input className="input-field text-sm" placeholder="Leave blank to use excerpt"
                value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
            </div>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{form.isPublished ? 'Published — visible to public' : 'Draft — not visible to public'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Toggle to publish or unpublish this post</p>
            </div>
            <button
              type="button"
              onClick={() => set('isPublished', !form.isPublished)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-teal-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main admin blog page ───────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing]     = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/api/blog/all');
    const d = await res.json();
    setPosts(d.posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (form) => {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success(form.isPublished ? '🎉 Post published!' : 'Draft saved!');
      setShowEditor(false);
      fetchPosts();
    } else {
      toast.error(d.error || 'Failed to save');
    }
  };

  const handleUpdate = async (form) => {
    const res = await fetch(`/api/blog/${editing.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success('Post updated!');
      setEditing(null);
      fetchPosts();
    } else {
      toast.error(d.error || 'Update failed');
    }
  };

  const togglePublish = async (post) => {
    const res = await fetch(`/api/blog/${post.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    if (res.ok) {
      toast.success(post.isPublished ? 'Post unpublished' : 'Post published!');
      fetchPosts();
    }
  };

  const handleDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/blog/${post.slug}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); fetchPosts(); }
    else toast.error('Delete failed');
  };

  const published = posts.filter(p => p.isPublished).length;
  const drafts    = posts.filter(p => !p.isPublished).length;

  const sourceIcon = (source) => source === 'linkedin'
    ? <Linkedin size={11} className="text-blue-500" />
    : <BookOpen size={11} className="text-brand-500" />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-slate-500 text-sm mt-1">
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchPosts} className="btn-ghost text-sm"><RefreshCw size={14} /></button>
          <button
            onClick={() => { setEditing(null); setShowEditor(true); }}
            className="btn-primary text-sm"
          >
            <Plus size={15} /> New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Posts', value: posts.length, color: 'text-slate-700' },
          { label: 'Published', value: published, color: 'text-teal-600' },
          { label: 'Drafts', value: drafts, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="admin-card text-center py-4">
            <div className={`text-2xl font-display font-bold ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* LinkedIn import tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Linkedin size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Importing a LinkedIn post?</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Click "New Post" → select "From LinkedIn" → paste the content you wrote on LinkedIn + add the original URL.
            It will appear on the blog with a "Originally on LinkedIn" badge and link.
          </p>
        </div>
      </div>

      {/* Posts table */}
      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">No posts yet</p>
            <p className="text-sm text-slate-400 mt-1">Click "New Post" to write your first article</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Title', 'Category', 'Source', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{post.title}</div>
                      <div className="text-xs text-slate-400 font-mono">/blog/{post.slug}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {sourceIcon(post.source)}
                        {post.source === 'linkedin' ? 'LinkedIn' : 'Internal'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[post.isPublished]}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                        : format(new Date(post.createdAt), 'MMM d, yyyy') + ' (draft)'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {/* Preview */}
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <button className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors" title="Preview">
                            <ExternalLink size={13} />
                          </button>
                        </a>
                        {/* Edit */}
                        <button
                          onClick={() => { setEditing(null); setTimeout(() => { setEditing(post); setShowEditor(false); }, 0); }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        {/* Toggle publish */}
                        <button
                          onClick={() => togglePublish(post)}
                          className={`p-1.5 rounded-lg transition-colors ${post.isPublished ? 'hover:bg-amber-50 text-teal-500 hover:text-amber-600' : 'hover:bg-teal-50 text-slate-400 hover:text-teal-600'}`}
                          title={post.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {post.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor modal */}
      {(showEditor || editing) && (
        <BlogEditor
          initial={editing}
          onSave={editing ? handleUpdate : handleCreate}
          onCancel={() => { setShowEditor(false); setEditing(null); }}
        />
      )}
    </div>
  );
}