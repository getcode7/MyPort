'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const BODY_CLASSES = `
  bg-[#f5f7fb] dark:bg-[#0b0f19]
  text-gray-900 dark:text-white
  overflow-x-hidden
  antialiased
  relative
`.trim().replace(/\s+/g, ' ');

const MAIN_CLASSES = "relative";

const BackgroundGlows = () => (
  <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
    <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
    <div className="absolute top-[-250px] right-[-100px] w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full" />
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} ${BODY_CLASSES}`}>
        <ThemeProvider>
          <LanguageProvider>
            <BackgroundGlows />
            <InteractiveBackground />
            <Navbar />
            <main className={MAIN_CLASSES}>{children}</main>
            <FloatingWhatsApp />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export { inter, BODY_CLASSES, MAIN_CLASSES };