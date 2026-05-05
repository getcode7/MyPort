'use client';

import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProjectsSection } from '@/components/ProjectsSection';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/seu-usuario',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://linkedin.com/in/seu-perfil',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'mailto:seu@email.com',
    label: 'Email',
    icon: Mail,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="container mx-auto px-4 py-16">
      <section className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <motion.div
          {...fadeUp}
          className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm"
        >
          <span className="mr-2" aria-hidden="true">
            ✨
          </span>
          <span>Engenharia Informática & Aplicações</span>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Criando{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Soluções
          </span>{' '}
          de Alto Impacto
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Focado em arquitetura de sistemas, desenvolvimento full-stack e criação
          de software escalável com código limpo.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="group">
            Ver Projetos
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button size="lg" variant="outline" onClick={toggleTheme} type="button">
            {theme === 'dark' ? '☀️' : '🌙'} Alternar Tema
          </Button>
        </motion.div>

        <motion.nav
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-12 flex items-center justify-center gap-6"
          aria-label="Links sociais"
        >
          {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </motion.nav>
      </section>

      <ProjectsSection />
    </main>
  );
}