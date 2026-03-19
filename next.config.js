/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // In Next.js 14.1+, this moved out of experimental
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

module.exports = nextConfig;