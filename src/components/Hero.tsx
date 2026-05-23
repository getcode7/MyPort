'use client';

// ============================================================================
// IMPORTS ORGANIZADOS POR CATEGORIA
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

// ============================================================================
// 1. CONSTANTES E CONFIGURAÇÕES (Centralizadas e tipadas)
// ============================================================================

/** Dados pessoais - Fonte única da verdade */
const PERSONAL_DATA = {
  name: "Ecleber Joel Araújo Monteiro",
  shortName: "Ecleber Monteiro",
  role: "Engenheiro Informático | Front-end & Full Stack",
  location: "Lisboa, Portugal",
  email: "eclebermonteiro26@gmail.com",
  github: "https://github.com/getcode7",
  linkedin: "https://www.linkedin.com/in/ecleber-araújo",
  bio: "Engenheiro Informático apaixonado por tecnologia e inovação, em busca da primeira oportunidade para transformar linhas de código em soluções que impactam vidas. Com forte compromisso com responsabilidade, confiança e profissionalismo, destaco-me pelo foco incansável em performance e otimização.",
  cvLink: "/mycv.pdf",
  stats: [
    { icon: MapPin, label: "Lisboa, Portugal", color: "text-blue-500" },
    { icon: Calendar, label: "4+ anos de estudo", color: "text-purple-500" },
    { icon: Award, label: "15+ projetos", color: "text-orange-500" },
  ],
  keywords: ["Responsabilidade", "Confiança", "Profissionalismo", "Performance"]
} as const;

/** Configurações de animação - Valores mágicos eliminados */
const ANIMATION = {
  container: { staggerChildren: 0.1, delayChildren: 0.3 },
  item: { type: 'spring' as const, stiffness: 100, y: 20 },
  photo: { duration: 0.8, type: 'spring' as const, scale: 0.8 },
  badge: { delay1: 0.4, delay2: 0.6, type: 'spring' as const },
  scrollIndicator: { delay: 1.5, duration: 1 },
  spin: { duration: 1.5, repeat: Infinity }
} as const;

/** Seletores DOM - Evita strings hardcoded */
const DOM_IDS = {
  projects: 'projects'
} as const;

/** Classes CSS reutilizáveis */
const STYLES = {
  section: "relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20 pt-32 md:pt-40",
  container: "relative z-10 max-w-7xl mx-auto w-full",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center",
  gradientText: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent",
  statusBadge: "inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full mb-6",
  primaryButton: "group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl px-8 h-14 text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95",
  secondaryButton: "inline-flex items-center gap-2 px-6 h-14 rounded-2xl font-bold text-base border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 transition-all"
} as const;

// ============================================================================
// 2. VARIANTES DE ANIMAÇÃO (Memoizadas para performance)
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
// 3. COMPONENTE PRINCIPAL (Memoizado)
// ============================================================================

export const Hero = memo(function Hero() {
  // Callbacks memoizados para evitar recriação em cada render
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
          
          {/* COLUNA ESQUERDA - FOTO E BADGES */}
          <PhotoColumn />

          {/* COLUNA DIREITA - CONTEÚDO PRINCIPAL */}
          <ContentColumn onProjectsClick={handleProjectsClick} />
          
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
});

// ============================================================================
// 4. SUB-COMPONENTES (Organizados por responsabilidade)
// ============================================================================

/** Componente de decoração de fundo */
const BackgroundDecoration = memo(function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
});

/** Coluna da foto com badges flutuantes */
const PhotoColumn = memo(function PhotoColumn() {
  return (
    <motion.div
      variants={photoVariants}
      initial="hidden"
      animate="visible"
      className="relative flex justify-center lg:justify-end"
    >
      <div className="relative">
        {/* Efeito de brilho externo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        
        {/* Container da foto com borda animada */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin-slow p-1" />
          
          {/* Foto de perfil */}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 p-1">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <Image 
                src="/avat.jpeg" 
                alt={PERSONAL_DATA.name}
                fill
                priority
                className="object-cover scale-110 opacity-80"
                style={{ objectPosition: '90% 80%' }}
                sizes="(max-width: 768px) 288px, (max-width: 1024px) 384px, 450px"
              />
            </div>
          </div>
        </div>

        {/* Badge de status (disponível) */}
        <FloatingBadge 
          position="bottom-right" 
          className="bg-white/90 dark:bg-gray-800/90"
          delay={ANIMATION.badge.delay1}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-bold">Disponível</span>
          </div>
        </FloatingBadge>

        {/* Badge de experiência */}
        <FloatingBadge 
          position="top-left" 
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          delay={ANIMATION.badge.delay2}
        >
          <div className="text-center">
            <div className="font-black text-lg md:text-2xl">4+</div>
            <div className="text-white/80 text-[10px] md:text-xs font-bold uppercase">Anos</div>
          </div>
        </FloatingBadge>
      </div>
    </motion.div>
  );
});

/** Coluna de conteúdo principal */
const ContentColumn = memo(function ContentColumn({ 
  onProjectsClick 
}: { 
  onProjectsClick: () => void 
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center lg:text-left"
    >
      {/* Badge de status com animação de ping */}
      <motion.div variants={itemVariants} className={STYLES.statusBadge}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          👋 Disponível para oportunidades
        </span>
      </motion.div>

      {/* Título principal */}
      <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-6 leading-[1.1]">
        <span className="block text-gray-900 dark:text-white">Olá, sou</span>
        <span className={STYLES.gradientText}>
          {PERSONAL_DATA.shortName}
        </span>
      </motion.h1>

      {/* Role / Cargo */}
      <motion.p variants={itemVariants} className="text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4">
        {PERSONAL_DATA.role}
      </motion.p>

      {/* Bio */}
      <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl lg:max-w-full mb-6 leading-relaxed">
        {PERSONAL_DATA.bio}
      </motion.p>

      {/* Keywords */}
      <KeywordsSection />

      {/* Stats */}
      <StatsSection />

      {/* Botões de ação */}
      <ActionButtons onProjectsClick={onProjectsClick} />

      {/* Links sociais */}
      <SocialLinksSection />
    </motion.div>
  );
});

/** Seção de keywords */
const KeywordsSection = memo(function KeywordsSection() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
      {PERSONAL_DATA.keywords.map((keyword) => (
        <span 
          key={keyword} 
          className="px-3 py-1.5 text-xs font-bold rounded-full bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 backdrop-blur-sm"
        >
          ✦ {keyword}
        </span>
      ))}
    </motion.div>
  );
});

/** Seção de estatísticas */
const StatsSection = memo(function StatsSection() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
      {PERSONAL_DATA.stats.map((stat, index) => (
        <div 
          key={index} 
          className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-800"
        >
          <stat.icon className={`w-4 h-4 ${stat.color}`} />
          <span className="text-sm font-medium">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
});

/** Botões de ação (Projetos e CV) */
const ActionButtons = memo(function ActionButtons({ 
  onProjectsClick 
}: { 
  onProjectsClick: () => void 
}) {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
      <Button 
        size="lg" 
        className={STYLES.primaryButton}
        onClick={onProjectsClick}
      >
        VER PROJETOS
        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>

      <a 
        href={PERSONAL_DATA.cvLink}
        download
        className={STYLES.secondaryButton}
      >
        <Download className="w-5 h-5" />
        DOWNLOAD CV
      </a>
    </motion.div>
  );
});

/** Links para redes sociais */
const SocialLinksSection = memo(function SocialLinksSection() {
  const socialLinks = useMemo(() => [
    { href: PERSONAL_DATA.github, icon: Github, label: "GitHub" },
    { href: PERSONAL_DATA.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: `mailto:${PERSONAL_DATA.email}`, icon: Mail, label: "Email" }
  ], []);

  return (
    <motion.div variants={itemVariants} className="flex justify-center lg:justify-start gap-4">
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
// 5. COMPONENTES UTILITÁRIOS (Reutilizáveis)
// ============================================================================

/** Badge flutuante com animação */
const FloatingBadge = memo(function FloatingBadge({ 
  children, 
  position, 
  className = '', 
  delay 
}: { 
  children: React.ReactNode
  position: 'top-left' | 'bottom-right'
  className?: string
  delay: number
}) {
  const positionClasses = position === 'top-left' 
    ? '-top-4 -left-4 md:-top-6 md:-left-6' 
    : '-bottom-4 -right-4 md:-bottom-6 md:-right-6';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: ANIMATION.badge.type }}
      className={`absolute ${positionClasses} backdrop-blur-md rounded-2xl shadow-2xl p-3 md:p-4 border border-gray-200/50 dark:border-gray-700/50 ${className}`}
    >
      {children}
    </motion.div>
  );
});

/** Link social com tooltip */
const SocialLink = memo(function SocialLink({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-3 rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
      aria-label={label}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 group-hover:text-blue-500 transition-all duration-300" />
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] bg-gray-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </a>
  );
});

/** Indicador de scroll animado */
const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: ANIMATION.scrollIndicator.delay, duration: ANIMATION.scrollIndicator.duration }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-8 border-2 border-gray-400/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: ANIMATION.spin.repeat, duration: ANIMATION.spin.duration }}
            className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"
          />
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// 6. NAMED EXPORTS PARA COMPONENTES INDIVIDUAIS (Opcional)
// ============================================================================
export { 
  BackgroundDecoration, 
  FloatingBadge, 
  SocialLink, 
  ScrollIndicator,
  PhotoColumn,
  ContentColumn
};