'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';

import {
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Sobre', href: '/sobre' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const metrics = useMemo(() => {
    const width = windowWidth;
    const t = Math.max(0, Math.min(1, (width - 480) / (1400 - 480)));
    const p = 90 * t;
    const px = 16 + t * 90;
    const h = 40;
    
    // AJUSTE: menuY reduzido para 45px para garantir que não sai do SVG
    const menuY = t * 33; 
    
    const blur = 6 + (1 - t) * 16;
    const radius = 14 + (1 - t) * 18;
    const thicknessOpacity = t;

    return { t, p, px, h, menuY, blur, radius, thicknessOpacity };
  }, [windowWidth]);

  const { p, px, h, menuY, blur, radius, thicknessOpacity } = metrics;

  const staticPath = `
    M0,0
    L1000,0
    L1000,${h}
    C900,${h}
     800,${h + p}
     500,${h + p}
    C200,${h + p}
     100,${h}
     0,${h}
    Z
  `;

  const thicknessPath = `
    M0,${h}
    C100,${h}
     200,${h + p + 3}
     500,${h + p + 3}
    C800,${h + p + 3}
     900,${h}
     1000,${h}
    L1000,${h + 2}
    C900,${h + 2}
     800,${h + p + 5}
     500,${h + p + 5}
    C200,${h + p + 5}
     100,${h + 2}
     0,${h + 2}
    Z
  `;

  const navOpacity = useTransform(scrollY, [0, 50], [1, 0.98]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <motion.div
          style={{ opacity: navOpacity }}
          className="relative w-full px-2 sm:px-3 md:px-4"
        >
          {/* Aumentei a altura do wrapper para 160 para não cortar o conteúdo rebaixado */}
          <div
            className="relative mx-auto"
            style={{
              height: 160, 
            }}
          >
            {/* FUNDO (SVG) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg
                viewBox="0 0 1000 160"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="navGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme === 'dark' ? '#0b0f19' : '#f8fafc'} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={theme === 'dark' ? '#0b0f19' : '#f8fafc'} stopOpacity={0.88} />
                  </linearGradient>
                </defs>
                
                <motion.path
                  animate={{ d: staticPath }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  fill="black"
                  fillOpacity="0.08"
                  className="blur-md translate-y-1"
                />
                
                <motion.path
                  animate={{ d: staticPath }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  fill="url(#navGradient)"
                />
                
                <motion.path
                  animate={{ d: thicknessPath, opacity: thicknessOpacity }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  fill={theme === 'dark' ? '#1e2433' : '#d1d9e8'}
                />
              </svg>
            </div>

            {/* CONTEÚDO - Ajustado para ser visível */}
            <div
              className="relative z-20 w-full pointer-events-auto"
              style={{ height: '100%' }} // Ocupa a altura total do wrapper
            >
              <motion.div
                animate={{ paddingLeft: px, paddingRight: px }}
                transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                className="w-full h-full flex items-start justify-between gap-2 min-w-0 pt-2" // items-start e pt-4 para alinhar o topo
              >
                {/* LOGO */}
                <Link href="/" className="group shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-[0_2px_0_rgb(30,58,138)] transition-all group-hover:translate-y-[1px] group-hover:shadow-none">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                </Link>

                {/* MENU - Desktop */}
                <motion.div
                  animate={{
                    opacity: windowWidth > 768 ? 1 : 0,
                    scale: windowWidth > 768 ? 1 : 0.96,
                    y: menuY, // Deslocamento para baixo
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                  className="hidden md:flex flex-1 justify-center min-w-0"
                >
                  <div className="flex items-center min-w-0 overflow-hidden bg-white/40 dark:bg-gray-800/40 backdrop-blur-md px-1 py-1 rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-sm">
                    {NAV_ITEMS.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <span className="px-2 lg:px-3 py-2 text-[11px] lg:text-[12px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap block">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* AÇÕES */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-gray-700/60 border border-white/40 dark:border-gray-700/40 transition-all shadow-sm"
                  >
                    {theme === 'dark' ? <Sun size={15} className="text-yellow-500" /> : <Moon size={15} className="text-gray-700" />}
                  </button>
                  <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                    className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} className="fixed top-[65px] left-4 right-4 z-[60] md:hidden">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-4">
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors flex items-center justify-between group">
                      {item.name}
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}