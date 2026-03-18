// src/app/layout.js
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'AetherSolve Technologies — Building Tomorrow\'s Solutions Today',
  description: 'AetherSolve Technologies is a premier IT services and product company delivering tailored websites, mobile apps, ERP systems, AI integrations, and managed cloud solutions for businesses across India and beyond.',
  keywords: 'web development, mobile app development, ERP, CRM, AI integration, IT services, digital transformation, AetherSolve',
  openGraph: {
    title: 'AetherSolve Technologies',
    description: 'Premier IT services & product company. We build, host, and grow your digital infrastructure.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
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
