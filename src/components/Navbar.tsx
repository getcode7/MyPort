'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Portfólio', href: '/portfolio' },
  { name: 'Sobre', href: '/sobre' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Geometria da curva 3D
  const p = 90; // Reduzi ligeiramente a profundidade para um look mais elegante
  const staticPath = `
    M0,0 
    L1000,0 
    L1000,5
    C900,5 800,${p} 500,${p} 
    C200,${p} 100,5 0,5 
    Z
  `;

  const thicknessPath = `
    M0,5
    C100,5 200,${p + 3} 500,${p + 3} 
    C800,${p + 3} 900,5 1000,5
    L1000,7
    C900,7 800,${p + 6} 500,${p + 6} 
    C200,${p + 6} 100,7 0,7
    Z
  `;

  return (
    <>
      <div className="h-20" />

      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="relative w-full h-[120px]">
          
          {/*  SVG com Efeitos 3D Refinados */}
          <svg
            viewBox="0 0 1000 120"
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="navGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme === 'dark' ? '#1f2937' : '#ffffff'} />
                <stop offset="100%" stopColor={theme === 'dark' ? '#111827' : '#f9fafb'} />
              </linearGradient>
              
              <filter id="innerShadow">
                <feOffset dx="0" dy="1" />
                <feGaussianBlur stdDeviation="2" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.08" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>

              <linearGradient id="borderHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor={theme === 'dark' ? '#4b5563' : '#f3f4f6'} stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Sombra Projetada */}
            <path
              d={staticPath}
              fill="black"
              fillOpacity="0.1"
              className="blur-md translate-y-1.5"
            />

            {/* Corpo Principal */}
            <path
              d={staticPath}
              fill="url(#navGradient)"
              filter="url(#innerShadow)"
            />

            {/* Espessura 3D */}
            <path
              d={thicknessPath}
              fill={theme === 'dark' ? '#374151' : '#e5e7eb'}
            />

            {/* Brilho Superior */}
            <path
              d="M0,0.5 L1000,0.5"
              stroke="url(#borderHighlight)"
              strokeWidth="1"
            />
          </svg>

          {/* Conteúdo da Navbar - Elementos Reduzidos */}
          <div className="relative z-10 w-full h-full flex items-start justify-center pointer-events-auto">
            <div className="w-full max-w-7xl px-10 md:px-20 flex items-center justify-between h-[70px]">
              
              {/* Logo - Tamanho Reduzido */}
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_2px_0_rgb(30,58,138)] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">
                  EA STUDIO
                </span>
              </Link>

              {/* Menu Desktop - Mais compacto */}
              <div className="hidden md:flex items-center bg-white/30 dark:bg-gray-800/20 backdrop-blur-sm px-1.5 py-1 rounded-xl border border-white/40 dark:border-gray-700/30">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <span className="px-4 py-1.5 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Ações - Apenas o Toggle de Tema */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700 shadow-sm"
                >
                  {theme === 'dark' ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-gray-500" />}
                </button>

                {/* Mobile Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-1.5 text-gray-700 dark:text-gray-300"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl p-4">
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}