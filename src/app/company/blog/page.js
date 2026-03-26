// src/app/company/blog/page.js
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog — AetherSolve Technologies',
  description: 'Engineering insights, product thinking, and technology perspectives from the AetherSolve team.',
};

export default function BlogPage() {
  return <BlogClient />;
}