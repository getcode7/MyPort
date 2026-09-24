'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, Cpu, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================
// TIPAGEM
// ============================================

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  impact: string;
  tech: string[];
  link: string;
  github: string;
}

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// ============================================
// COMPONENTE
// ============================================

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const { t, language } = useLanguage();

  const projects = (t.projects.list ?? []) as ProjectData[];
  const project = projects.find((p) => p.slug === slug);

  // Projeto não encontrado
  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">
            {language === 'pt' ? 'Projeto não encontrado' : 'Project not found'}
          </h1>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'pt' ? 'Voltar aos projetos' : 'Back to projects'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-24 md:pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Botão Voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'pt' ? 'Voltar aos projetos' : 'Back to projects'}
          </Link>
        </motion.div>

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {project.impact}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              2024
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            {project.title}
          </h1>
        </motion.div>

        {/* Placeholder visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-12 flex items-center justify-center text-6xl"
        >
          🏗️
        </motion.div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                {language === 'pt' ? 'Sobre o projeto' : 'About the project'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                {language === 'pt' ? 'Tecnologias' : 'Technologies'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/30 dark:border-blue-800/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg font-bold mb-4">
                {language === 'pt' ? 'Links úteis' : 'Useful links'}
              </h3>
              <div className="space-y-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                >
                  <Github className="w-5 h-5" />
                  <span>
                    {language === 'pt' ? 'Ver código fonte' : 'View source code'}
                  </span>
                </a>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>
                    {language === 'pt' ? 'Ver demo ao vivo' : 'View live demo'}
                  </span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30"
            >
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                {language === 'pt' ? 'Próximos passos' : 'Next steps'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'pt'
                  ? 'Este projeto está em constante evolução. Novas funcionalidades e melhorias estão a ser desenvolvidas.'
                  : 'This project is constantly evolving. New features and improvements are being developed.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}