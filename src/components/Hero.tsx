'use client';

// ============================================================================
// IMPORTS
// ============================================================================
import React, { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Download,
  Calendar,
  Award,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================================================
// 1. CONSTANTES E CONFIGURAÇÕES
// ============================================================================

const PERSONAL_DATA = {
  name: "Ecleber Joel Araújo Monteiro",
  shortName: "Ecleber Monteiro",
  email: "eclebermonteiro26@gmail.com",
  github: "https://github.com/getcode7",
  linkedin: "https://www.linkedin.com/in/ecleber-araújo",
  cvLink: "/mycv.pdf",
} as const;

const ANIMATION = {
  container: { staggerChildren: 0.1, delayChildren: 0.3 },
  item: { type: 'spring' as const, stiffness: 100, y: 20 },
  photo: { duration: 0.8, type: 'spring' as const, scale: 0.8 },
  badge: { delay1: 0.4, delay2: 0.6, type: 'spring' as const },
  scrollIndicator: { delay: 1.5, duration: 1 },
  spin: { duration: 1.5, repeat: Infinity }
} as const;

const DOM_IDS = {
  projects: 'projects'
} as const;

const STYLES = {
  section: "relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20 pt-24 sm:pt-32 md:pt-40",
  container: "relative z-10 max-w-7xl mx-auto w-full",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center",
  gradientText: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent",
  statusBadge: "inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full mb-4 sm:mb-6",
  primaryButton: "group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95",
  secondaryButton: "inline-flex items-center gap-2 px-5 sm:px-6 h-12 sm:h-14 rounded-2xl font-bold text-sm sm:text-base border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
} as const;

// ============================================================================
// 2. VARIANTES DE ANIMAÇÃO
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: ANIMATION.container.staggerChildren, 
      delayChildren: ANIMATION.container.delayChildren 
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: ANIMATION.item.y },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: ANIMATION.item.type, 
      stiffness: ANIMATION.item.stiffness 
    }
  }
};

const photoVariants: Variants = {
  hidden: { opacity: 0, scale: ANIMATION.photo.scale },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: ANIMATION.photo.duration, 
      type: ANIMATION.photo.type 
    }
  }
};

// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================

export const Hero = memo(function Hero() {
  const { t, language } = useLanguage();
  
  const handleProjectsClick = useCallback(() => {
    const projectsSection = document.getElementById(DOM_IDS.projects);
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section className={STYLES.section}>
      <BackgroundDecoration />
      
      <div className={STYLES.container}>
        <div className={STYLES.grid}>
          <PhotoColumn t={t} language={language} />
          <ContentColumn 
            onProjectsClick={handleProjectsClick}
            t={t}
            language={language}
          />
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
});

// ============================================================================
// 4. SUB-COMPONENTES
// ============================================================================

const BackgroundDecoration = memo(function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
      <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
});

const PhotoColumn = memo(function PhotoColumn({ t, language }: { t: any; language: string }) {
  return (
    <motion.div
      variants={photoVariants}
      initial="hidden"
      animate="visible"
      className="relative flex justify-center lg:justify-end order-first lg:order-none"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow p-1" />
          
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 p-1">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <Image 
                src="/avat.jpeg" 
                alt={PERSONAL_DATA.name}
                fill
                priority
                className="object-cover scale-110 opacity-80"
                style={{ objectPosition: '90% 80%' }}
                sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 450px"
              />
            </div>
          </div>
        </div>

        <FloatingBadge 
          position="bottom-right" 
          className="bg-white/90 dark:bg-gray-800/90"
          delay={ANIMATION.badge.delay1}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold">{t.hero.available}</span>
          </div>
        </FloatingBadge>

        <FloatingBadge 
          position="top-left" 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          delay={ANIMATION.badge.delay2}
        >
          <div className="text-center">
            <div className="font-black text-base sm:text-lg md:text-2xl">4+</div>
            <div className="text-white/80 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase">
              {t.badge.years}
            </div>
          </div>
        </FloatingBadge>
      </div>
    </motion.div>
  );
});

const ContentColumn = memo(function ContentColumn({ 
  onProjectsClick,
  t,
  language
}: { 
  onProjectsClick: () => void;
  t: any;
  language: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center lg:text-left"
    >
      <motion.div variants={itemVariants} className={STYLES.statusBadge}>
        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
        </span>
        <span className="text-[10px] sm:text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400">
          👋 {t.hero.available}
        </span>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tighter mb-3 sm:mb-4 md:mb-6 leading-[1.1]">
        <span className="block text-gray-900 dark:text-white text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-normal">
          {language === 'pt' ? 'Olá, sou' : "Hi, I'm"}
        </span>
        <span className={STYLES.gradientText}>
          {PERSONAL_DATA.shortName}
        </span>
      </motion.h1>

      <motion.p variants={itemVariants} className="
          text-base sm:text-lg md:text-xl lg:text-2xl 
          font-bold 
          text-gray-600 
          dark:text-gray-300 
          max-w-2xl 
          mb-4 sm:mb-6 
          leading-relaxed 
          hyphens-auto
          break-words
          mx-auto
          lg:mx-0">
        {t.hero.subtitle}
      </motion.p>

      <motion.p variants={itemVariants} className="
            text-sm sm:text-base md:text-lg 
            text-gray-500 
            dark:text-gray-400 
            max-w-2xl 
            lg:max-w-full 
            mb-4 sm:mb-6 
            leading-relaxed 
            text-justify 
            hyphens-auto
            break-words
            mx-auto
            lg:mx-0">
        {t.hero.description}
      </motion.p>

      <KeywordsSection t={t} />
      <StatsSection t={t} />
      <ActionButtons onProjectsClick={onProjectsClick} t={t} />
      <SocialLinksSection />
    </motion.div>
  );
});

const KeywordsSection = memo(function KeywordsSection({ t }: { t: any }) {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
      {t.hero.keywords.map((keyword: string) => (
        <span 
          key={keyword} 
          className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] md:text-xs font-bold rounded-full bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 backdrop-blur-sm"
        >
          ✦ {keyword}
        </span>
      ))}
    </motion.div>
  );
});

const StatsSection = memo(function StatsSection({ t }: { t: any }) {
  const stats = [
    { icon: MapPin, label: t.footer.location, color: "text-blue-500" },
    { icon: Calendar, label: t.stats.years, color: "text-purple-500" },
    { icon: Award, label: t.stats.projects, color: "text-orange-500" },
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-800"
        >
          <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
          <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
});

const ActionButtons = memo(function ActionButtons({ 
  onProjectsClick,
  t
}: { 
  onProjectsClick: () => void;
  t: any;
}) {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
      <Button 
        size="lg" 
        className={STYLES.primaryButton}
        onClick={onProjectsClick}
      >
        {t.hero.ctaProjects}
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>

      <a 
        href={PERSONAL_DATA.cvLink}
        download
        className={STYLES.secondaryButton}
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden xs:inline">{t.common.downloadCV}</span>
        <span className="xs:hidden">CV</span>
      </a>
    </motion.div>
  );
});

const SocialLinksSection = memo(function SocialLinksSection() {
  const socialLinks = useMemo(() => [
    { href: PERSONAL_DATA.github, icon: Github, label: "GitHub" },
    { href: PERSONAL_DATA.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: `mailto:${PERSONAL_DATA.email}`, icon: Mail, label: "Email" }
  ], []);

  return (
    <motion.div variants={itemVariants} className="flex justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4">
      {socialLinks.map((link) => (
        <SocialLink 
          key={link.label}
          href={link.href}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </motion.div>
  );
});

// ============================================================================
// 5. COMPONENTES UTILITÁRIOS
// ============================================================================

const FloatingBadge = memo(function FloatingBadge({ 
  children, 
  position, 
  className = '', 
  delay 
}: { 
  children: React.ReactNode;
  position: 'top-left' | 'bottom-right';
  className?: string;
  delay: number;
}) {
  const positionClasses = position === 'top-left' 
    ? '-top-3 -left-3 sm:-top-4 sm:-left-4 md:-top-6 md:-left-6' 
    : '-bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: ANIMATION.badge.type }}
      className={`absolute ${positionClasses} backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-3 md:p-4 border border-gray-200/50 dark:border-gray-700/50 ${className}`}
    >
      {children}
    </motion.div>
  );
});

const SocialLink = memo(function SocialLink({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
      aria-label={label}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300" />
      <span className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </a>
  );
});

const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: ANIMATION.scrollIndicator.delay, duration: ANIMATION.scrollIndicator.duration }}
      className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
    >
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        <div className="w-4 h-6 sm:w-5 sm:h-8 border-2 border-gray-400/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1.5 sm:w-1.5 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2"
          />
        </div>
        <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          Scroll
        </span>
      </div>
    </motion.div>
  );
});

// ============================================================================
// 6. NAMED EXPORTS
// ============================================================================
export { 
  BackgroundDecoration, 
  FloatingBadge, 
  SocialLink, 
  ScrollIndicator,
  PhotoColumn,
  ContentColumn
};