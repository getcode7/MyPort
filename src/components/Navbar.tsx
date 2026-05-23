'use client';

// ============================================================================
// IMPORTS ORGANIZADOS
// ============================================================================
import { useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// ============================================================================
// 1. CONSTANTES (Mantendo os valores originais)
// ============================================================================

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Sobre', href: '/sobre' },
] as const;

// ============================================================================
// 2. COMPONENTE PRINCIPAL (Exatamente mesma lógica do original)
// ============================================================================

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();

  // Effect para resize (mesmo do original)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Função getCurveDepth (exatamente igual)
  const getCurveDepth = useCallback((width: number) => {
    if (width >= 1024) return 90;
    if (width <= 640) return 0;
    return ((width - 640) / (1024 - 640)) * 90;
  }, []);

  const p = getCurveDepth(windowWidth);
  
  // Paths originais (exatamente iguais)
  const staticPath = `M0,0 L1000,0 L1000,5 C950,5 850,${p} 500,${p} C150,${p} 50,5 0,5 Z`;
  const thicknessPath = `M0,5 C50,5 150,${p + 3} 500,${p + 3} C850,${p + 3} 950,5 1000,5 L1000,7 C950,7 850,${p + 6} 500,${p + 6} C150,${p + 6} 50,7 0,7 Z`;

  // Opacidade baseada no scroll (mesmo do original)
  const navOpacity = useTransform(scrollY, [0, 50], [1, 0.95]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <motion.div 
          style={{ opacity: navOpacity }}
          className="relative w-full h-[80px] sm:h-[100px] md:h-[120px]"
        >
          
          {/* SVG ANIMADO - Exatamente igual ao original */}
          <svg
            viewBox="0 0 1000 120"
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="navGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#0b0f19' : '#f5f7fb'} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#0b0f19' : '#f5f7fb'} />
              </linearGradient>
              <filter id="innerShadow">
                <feOffset dx="0" dy="1" /><feGaussianBlur stdDeviation="2" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.08" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
            </defs>
            <motion.path animate={{ d: staticPath }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} fill="black" fillOpacity="0.1" className="blur-md translate-y-1.5" />
            <motion.path animate={{ d: staticPath }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} fill="url(#navGradient)" filter="url(#innerShadow)" />
            <motion.path animate={{ d: thicknessPath, opacity: p > 10 ? 1 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} fill={theme === 'dark' ? '#161b27' : '#e2e8f0'} />
          </svg>

          {/* Fundo de Blur para Mobile - Exatamente igual */}
          <motion.div 
            className="absolute inset-0 md:hidden pointer-events-none"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.4)' : 'rgba(245, 247, 251, 0.4)',
              backdropFilter: `blur(${(90 - p) / 10}px)`,
              opacity: (90 - p) / 90
            }}
          />

          {/* CONTEÚDO - Exatamente igual */}
          <div className="relative z-10 w-full h-full flex items-start justify-center pointer-events-auto">
            <div className={`
              w-full max-w-7xl flex items-center justify-between
              px-6 sm:px-12 md:px-20 lg:px-28
              h-[50px] sm:h-[60px] md:h-[75px]
              ${p > 45 ? 'pt-2 md:pt-4' : 'pt-0'} 
              transition-all duration-500
            `}>
              
              {/* Logo - Exatamente igual */}
              <Link href="/" className="group shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_2px_0_rgb(30,58,138)] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                  <span className="text-white font-bold text-xs sm:text-sm">E</span>
                </div>
              </Link>

              {/* Menu Desktop - Exatamente igual */}
              <div className="hidden md:flex items-center bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm px-1.5 py-1 rounded-xl border border-white/40 dark:border-gray-700/30 mx-4">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <span className="px-3 lg:px-4 py-1.5 text-[12px] lg:text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Ações - Exatamente igual */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button onClick={toggleTheme} className="p-1.5 rounded-md bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700 shadow-sm">
                  {theme === 'dark' ? <Sun size={14} className="text-yellow-500" /> : <Moon size={14} className="text-gray-500" />}
                </button>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                  {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Menu Mobile - Exatamente igual */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }} 
              className="fixed top-[60px] left-4 right-4 z-[60] md:hidden"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-4">
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors flex items-center justify-between group"
                    >
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