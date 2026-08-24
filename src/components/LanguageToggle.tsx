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
      className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all flex items-center justify-center text-base shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle language"
    >
      {language === 'pt' ? '🇬🇧' : '🇵🇹'}
    </motion.button>
  );
}