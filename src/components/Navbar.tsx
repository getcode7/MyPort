'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageToggle } from '@/components/LanguageToggle';

// ============================================================================
// CONSTANTES - NAVEGAÇÃO TRADUZIDA (ÂNCORAS)
// ============================================================================

const NAV_ITEMS = {
  en: [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ],
  pt: [
    { name: 'Início', href: '#home' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Competências', href: '#skills' },
    { name: 'Contato', href: '#contact' },
  ],
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function Navbar() {
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState('home');

  // Obter os items de navegação conforme o idioma
  const navItems = NAV_ITEMS[language] || NAV_ITEMS.pt;

  // Detectar secção ativa
  useEffect(() => {
    const sections = ['home', 'projects', 'skills', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId);
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Scroll suave para âncoras
  const scrollToSection = (href: string) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Opacidade da navbar com o scroll
  const navOpacity = useTransform(scrollY, [0, 50], [1, 0.92]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <motion.div
          style={{ opacity: navOpacity }}
          className="relative w-full px-2 sm:px-3 md:px-4 pt-2"
        >
          <div className="relative mx-auto max-w-7xl pointer-events-auto">
            <div
              className={`
                w-full rounded-2xl backdrop-blur-xl border
                ${theme === 'dark'
                  ? 'bg-gray-900/80 border-gray-700/50'
                  : 'bg-white/80 border-gray-200/50'
                }
                shadow-lg
              `}
            >
              <div className="flex items-center justify-between gap-2 px-4 py-2 min-h-[56px]">
                {/* LOGO */}
                <button
                  onClick={() => scrollToSection('#home')}
                  className="group shrink-0 focus:outline-none"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-[0_2px_0_rgb(30,58,138)] transition-all group-hover:translate-y-[1px] group-hover:shadow-none">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                </button>

                {/* MENU - Desktop */}
                <div className="hidden md:flex flex-1 justify-center min-w-0">
                  <div className="flex items-center gap-1 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm px-2 py-1 rounded-xl border border-white/40 dark:border-gray-700/40">
                    {navItems.map((item) => {
                      const isActive = activeSection === item.href.replace('#', '');
                      return (
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className={`
                            relative px-2 lg:px-3 py-2 text-[11px] lg:text-[12px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap block rounded-lg
                            ${isActive
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20'
                              : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/5 dark:hover:bg-blue-500/10'
                            }
                          `}
                        >
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="navbar-indicator"
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {/* Toggle de Tema */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-gray-700/60 border border-white/40 dark:border-gray-700/40 transition-all shadow-sm"
                    aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                  >
                    {theme === 'dark' ? (
                      <Sun size={15} className="text-yellow-500" />
                    ) : (
                      <Moon size={15} className="text-gray-700" />
                    )}
                  </button>

                  {/* Language Toggle - BOTÃO DE IDIOMA */}
                  <LanguageToggle />

                  {/* Menu Mobile Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                    aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                  >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[70px] left-4 right-4 z-[60] md:hidden"
            >
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-4">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.href.replace('#', '');
                    return (
                      <button
                        key={item.name}
                        onClick={() => scrollToSection(item.href)}
                        className={`
                          px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-between group w-full text-left
                          ${isActive
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                          }
                        `}
                      >
                        {item.name}
                        <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}