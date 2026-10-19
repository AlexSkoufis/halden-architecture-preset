import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { Inter_Tight, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google';
import { srcSet } from '@/components/Img';
import { studio, featured } from '@/lib/content';
import './globals.css';

const sans = Inter_Tight({ subsets: ['latin', 'greek'], weight: 'variable', variable: '--font-sans', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${studio.fullName} — ${studio.descriptor}`,
  description: `${studio.fullName}: ${studio.descriptor.toLowerCase()}. ${studio.offices}.`,
  openGraph: {
    title: studio.fullName,
    description: studio.descriptor,
    images: [`/img/${featured[0].image}-1600.webp`],
  },
};

export const viewport: Viewport = { themeColor: '#f3f1ec', width: 'device-width', initialScale: 1 };

// Set before first paint so CSS can size the scroll sequences without a layout jump.
const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only the first hero image is preloaded; everything else is lazy.
  preload(`/img/${featured[0].image}-1200.avif`, { as: 'image', imageSrcSet: srcSet(featured[0].image, 'avif'), imageSizes: '100vw', type: 'image/avif', fetchPriority: 'high' });

  return (
    // suppressHydrationWarning: the inline script adds the `motion` class to <html> before
    // React hydrates; that intentional pre-paint change must not count as a mismatch.
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
