'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLang);
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all text-xs font-bold shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle language"
    >
      <span className={language === 'pt' ? 'text-blue-400' : 'text-gray-400'}>
        PT
      </span>
      <span className="text-gray-500 text-[10px]">|</span>
      <span className={language === 'en' ? 'text-blue-400' : 'text-gray-400'}>
        EN
      </span>
    </motion.button>
  );
}