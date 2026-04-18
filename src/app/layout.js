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
      { url: '/newaether.png', type: 'image/png', sizes: '512x512' },
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/aether.png" type="image/png" />
        <link rel="apple-touch-icon" href="/aether.png" />
        {/* Google Fonts — Outfit (display) + Manrope (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Inline script to prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('ast-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Manrope, sans-serif',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#ff5c1a', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}