'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Github, Linkedin, Mail, ExternalLink,
  Terminal, Database, Layers, Award, Target,
  Code2, Sparkles, FileText, MapPin, Calendar, CheckCircle
} from 'lucide-react';
import { Hero } from '@/components/Hero';
import { QuoteForm } from '@/components/QuoteForm';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================
// TIPAGEM DOS DADOS
// ============================================

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  impact: string;
  color: string;
}

interface Skill {
  name: string;
  description: string;
  items: string[];
}

interface Experience {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

// ============================================
// MAPEAMENTO DE ÍCONES PARA SKILLS
// ============================================

const skillIcons: Record<string, React.ReactNode> = {
  Frontend: <Globe className="w-5 h-5" />,
  Backend: <Terminal className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  DevOps: <Layers className="w-5 h-5" />,
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Home() {
  const { t, language } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Dados traduzidos
  const projects = t.projects.list || [];
  const skills = t.technicalSkills.list || [];
  const experiences = t.experience.items || [];

  // Filtragem de projetos
  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter((p: Project) => p.tech.some((tech: string) => tech.toLowerCase().includes(filter)));

  // Mapeamento de filtros para tradução
  const filterLabels: Record<string, string> = {
    all: t.projects.filters.all,
    react: t.projects.filters.react,
    'next.js': t.projects.filters.nextjs,
    'node.js': t.projects.filters.nodejs,
    python: t.projects.filters.python,
    docker: t.projects.filters.docker,
    firebase: t.projects.filters.firebase,
  };

  // Dados das estatísticas
  const statsData = [
    { value: "4+", icon: "🎓", labelKey: "years" },
    { value: "15+", icon: "💻", labelKey: "projects" },
    { value: "8+", icon: "🚀", labelKey: "technologies" },
    { value: "100%", icon: "⭐", labelKey: "dedication" }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 relative overflow-hidden">

      {/* Efeito de Fundo Global */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-[80px]"
          style={{ transformOrigin: 'top left' }}
        />
        <motion.div
          initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-[80px]"
          style={{ transformOrigin: 'top right' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Hero />

        {/* Estatísticas */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsData.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
                    {idx === 0 && t.stats.years}
                    {idx === 1 && t.stats.projects}
                    {idx === 2 && t.stats.technologies}
                    {idx === 3 && t.stats.dedication}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Soft Skills */}
        <section className="py-20 bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-500/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">{t.softSkills.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">{t.softSkills.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Target className="w-5 h-5" />, nameKey: "problemSolving", descKey: "problemSolvingDesc" },
                { icon: <Sparkles className="w-5 h-5" />, nameKey: "technicalCommunication", descKey: "technicalCommunicationDesc" },
                { icon: <Award className="w-5 h-5" />, nameKey: "continuousLearning", descKey: "continuousLearningDesc" },
                { icon: <Code2 className="w-5 h-5" />, nameKey: "teamwork", descKey: "teamworkDesc" },
              ].map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">{skill.icon}</div>
                  <h3 className="text-xl font-black mb-2">
                    {t.softSkills.skills[skill.nameKey as keyof typeof t.softSkills.skills]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.softSkills.skills[skill.descKey as keyof typeof t.softSkills.skills]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experiência e Formação */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">{t.experience.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{t.experience.subtitle}</p>
            </div>
            <div className="space-y-8">
              {experiences.map((exp: Experience, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8 border-l-2 border-blue-500"
                >
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
                  <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black">{exp.role}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-bold">{exp.company}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-500 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Técnicas */}
        <section className="py-32" id="skills">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">{t.technicalSkills.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t.technicalSkills.subtitle}
                  <span className="text-blue-500 font-bold">{t.technicalSkills.focus}</span>
                </p>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600 to-transparent hidden md:block mb-4 ml-10 opacity-30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill: Skill, index: number) => {
                const icon = skillIcons[skill.name] || <Globe className="w-5 h-5" />;
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2rem] border border-white/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                      {icon}
                    </div>
                    <h3 className="text-xl font-black mb-2">{skill.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{skill.description}</p>
                    <ul className="space-y-2 mb-6">
                      {skill.items.map((item: string) => (
                        <li key={item} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{t.technicalSkills.proficiency}</span>
                        <span className="font-bold text-blue-500">{(index + 1) * 5 + 70}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(index + 1) * 5 + 70}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section com Filtros */}
        <section className="py-32" id="projects">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-4xl font-black mb-4 tracking-tight">{t.projects.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t.projects.subtitle}
                <span className="text-purple-500 font-bold">{t.projects.focus}</span>
              </p>

              {/* Filtros de Tecnologia */}
              <div className="flex flex-wrap gap-2 mt-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
                    }`}
                  aria-label="Filtrar todos os projetos"
                >
                  {t.projects.filters.all}
                </button>
                {['react', 'next.js', 'node.js', 'python', 'docker', 'firebase'].map(tech => (
                  <button
                    key={tech}
                    onClick={() => setFilter(tech)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === tech
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
                      }`}
                    aria-label={`Filtrar projetos por ${tech}`}
                  >
                    {filterLabels[tech] || tech}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all flex flex-col"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                      {project.impact}
                    </span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {project.tech.map((tech: string) => (
                        <span key={tech} className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-800/50">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-6 leading-relaxed text-sm flex-1">
                      {project.description}
                    </p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-black hover:text-blue-600 transition-colors">
                        <Github className="w-4 h-4" />
                        {t.projects.code}
                      </a>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-black hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        {t.projects.demo}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6 backdrop-blur-sm border border-green-500/20"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t.footer.location}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white"
            >
              {t.footer.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 mt-6 max-w-lg mx-auto font-medium"
            >
              {t.footer.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span>{t.footer.cta}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <div className="max-w-2xl mx-auto w-full">
                  <QuoteForm onSuccess={() => setShowForm(false)} />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <a href="https://github.com/getcode7" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="GitHub">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com/in/getcode7" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:ecleber.dev@outlook.com" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Email">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-20 text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase text-[10px]"
            >
              © {new Date().getFullYear()} {t.footer.copyright}
            </motion.p>
          </div>
        </footer>
      </div>
    </main>
  );
}