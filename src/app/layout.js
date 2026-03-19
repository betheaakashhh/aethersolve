// src/app/layout.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "AetherSolve Technologies — Building Tomorrow's Solutions Today",
  description: 'AetherSolve Technologies is a premier IT services and product company delivering tailored websites, mobile apps, ERP systems, AI integrations, and managed cloud solutions.',
  keywords: 'web development, mobile app development, ERP, CRM, AI integration, IT services, digital transformation, AetherSolve',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/aether.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/aether.png',
  },
  openGraph: {
    title: 'AetherSolve Technologies',
    description: 'Premier IT services & product company. We build, host, maintain and grow your digital infrastructure.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AetherSolve Technologies' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AetherSolve Technologies',
    description: 'Premier IT services & product company.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* favicon.ico — browser tab icon (convert aether.png to .ico at favicon.io) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* PNG fallback for modern browsers */}
        <link rel="icon" href="/aether.png" type="image/png" />
        {/* Apple devices home screen */}
        <link rel="apple-touch-icon" href="/aether.png" />
        <meta name="theme-color" content="#006ec7" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#0c8de9', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}