'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Globe, Github, Linkedin, Mail, ExternalLink,
  Terminal, Database, Layers, Award, Target,
  Code2, Sparkles, MapPin, Calendar, CheckCircle,
} from 'lucide-react';
import { Hero } from '@/components/Hero';
import { QuoteForm } from '@/components/QuoteForm';
import { ReelsSection } from '@/components/ReelsSection';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================
// TIPAGEM
// ============================================

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  impact: string;
  color?: string;
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

interface StatItem {
  value: string;
  icon: string;
  labelKey: 'years' | 'projects' | 'technologies' | 'dedication';
}

interface SoftSkill {
  icon: React.ReactNode;
  nameKey: keyof ReturnType<typeof useLanguage>['t']['softSkills']['skills'];
  descKey: keyof ReturnType<typeof useLanguage>['t']['softSkills']['skills'];
}

// ============================================
// CONSTANTES
// ============================================

/** Tecnologias disponíveis para filtragem de projetos */
const PROJECT_FILTERS = [
  'react',
  'next.js',
  'node.js',
  'python',
  'docker',
  'firebase',
] as const;

/** Ícones associados a cada categoria de skill técnica */
const SKILL_ICONS: Record<string, React.ReactNode> = {
  Frontend: <Globe className="w-5 h-5" />,
  Backend: <Terminal className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  DevOps: <Layers className="w-5 h-5" />,
};

/** Dados das estatísticas */
const STATS: StatItem[] = [
  { value: '4+', icon: '🎓', labelKey: 'years' },
  { value: '15+', icon: '💻', labelKey: 'projects' },
  { value: '8+', icon: '🚀', labelKey: 'technologies' },
  { value: '100%', icon: '⭐', labelKey: 'dedication' },
];

/** Soft skills exibidas na secção correspondente */
const SOFT_SKILLS: SoftSkill[] = [
  { icon: <Target className="w-5 h-5" />, nameKey: 'problemSolving', descKey: 'problemSolvingDesc' },
  { icon: <Sparkles className="w-5 h-5" />, nameKey: 'technicalCommunication', descKey: 'technicalCommunicationDesc' },
  { icon: <Award className="w-5 h-5" />, nameKey: 'continuousLearning', descKey: 'continuousLearningDesc' },
  { icon: <Code2 className="w-5 h-5" />, nameKey: 'teamwork', descKey: 'teamworkDesc' },
];

/** Rota do projeto em destaque */
const FEATURED_PROJECT_URL = '/projects/gestao-inteligente';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Home() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Dados traduzidos
  const projects = (t.projects.list ?? []) as Project[];
  const skills = t.technicalSkills.list ?? [];
  const experiences = (t.experience.items ?? []) as Experience[];

  // Projetos filtrados por tecnologia
  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((project) =>
          project.tech.some((tech) => tech.toLowerCase().includes(filter))
        );

  // Labels dos filtros (traduzidos)
  const filterLabels: Record<string, string> = {
    all: t.projects.filters.all,
    react: t.projects.filters.react,
    'next.js': t.projects.filters.nextjs,
    'node.js': t.projects.filters.nodejs,
    python: t.projects.filters.python,
    docker: t.projects.filters.docker,
    firebase: t.projects.filters.firebase,
  };

  const handleProjectClick = useCallback(
    (url: string) => {
      router.push(url);
    },
    [router]
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900 relative overflow-hidden">
      <BackgroundDecorations />

      <div className="relative z-10">
        <Hero />

        {/* Estatísticas */}
        <section className="py-20" aria-labelledby="stats-title">
          <div className="max-w-5xl mx-auto px-6">
            <h2 id="stats-title" className="sr-only">
              {language === 'pt' ? 'Estatísticas' : 'Statistics'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
                    {t.stats[stat.labelKey]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Soft Skills */}
        <section
          className="py-20 bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-500/5"
          aria-labelledby="soft-skills-title"
        >
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeading
              id="soft-skills-title"
              title={t.softSkills.title}
              subtitle={t.softSkills.subtitle}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SOFT_SKILLS.map((skill, idx) => (
                <motion.div
                  key={skill.nameKey}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2">
                    {t.softSkills.skills[skill.nameKey]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.softSkills.skills[skill.descKey]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experiência */}
        <section className="py-20" aria-labelledby="experience-title">
          <div className="max-w-5xl mx-auto px-6">
            <SectionHeading
              id="experience-title"
              title={t.experience.title}
              subtitle={t.experience.subtitle}
            />
            <div className="space-y-8">
              {experiences.map((exp, idx) => (
                <ExperienceItem key={idx} experience={exp} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Skills Técnicas */}
        <section className="py-32" id="skills" aria-labelledby="skills-title">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div>
                <h2 id="skills-title" className="text-4xl font-black mb-4 tracking-tight">
                  {t.technicalSkills.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t.technicalSkills.subtitle}
                  <span className="text-blue-500 font-bold">
                    {t.technicalSkills.focus}
                  </span>
                </p>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600 to-transparent hidden md:block mb-4 ml-10 opacity-30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill: Skill, index: number) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section className="py-32" id="projects" aria-labelledby="projects-title">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-20">
              <h2 id="projects-title" className="text-4xl font-black mb-4 tracking-tight">
                {t.projects.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t.projects.subtitle}
                <span className="text-purple-500 font-bold">{t.projects.focus}</span>
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                <FilterButton
                  active={filter === 'all'}
                  label={t.projects.filters.all}
                  onClick={() => setFilter('all')}
                  ariaLabel="Filtrar todos os projetos"
                />
                {PROJECT_FILTERS.map((tech) => (
                  <FilterButton
                    key={tech}
                    active={filter === tech}
                    label={filterLabels[tech] ?? tech}
                    onClick={() => setFilter(tech)}
                    ariaLabel={`Filtrar projetos por ${tech}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  labels={{
                    code: t.projects.code,
                    demo: t.projects.demo,
                  }}
                  onOpen={() => handleProjectClick(FEATURED_PROJECT_URL)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Reels */}
        <ReelsSection />

        {/* Footer */}
        <Footer
          t={t}
          showForm={showForm}
          onShowForm={setShowForm}
        />
      </div>
    </main>
  );
}

// ============================================
// SUB-COMPONENTES
// ============================================

function BackgroundDecorations() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
        animate={{ scaleX: 1, scaleY: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-[80px]"
        style={{ transformOrigin: 'top left' }}
      />
      <motion.div
        initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
        animate={{ scaleX: 1, scaleY: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-[80px]"
        style={{ transformOrigin: 'top right' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
    </div>
  );
}

function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-16">
      <h2 id={id} className="text-4xl font-black mb-4 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

function ExperienceItem({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 border-l-2 border-blue-500"
    >
      <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0" />
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all">
        <div className="flex flex-wrap justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black">{experience.role}</h3>
            <p className="text-blue-600 dark:text-blue-400 font-bold">
              {experience.company}
            </p>
          </div>
          <span className="text-sm font-bold text-gray-500 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {experience.period}
          </span>
        </div>
        <ul className="space-y-2">
          {experience.achievements.map((achievement, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
            >
              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const icon = SKILL_ICONS[skill.name] ?? <Globe className="w-5 h-5" />;
  const level = `${(index + 1) * 5 + 70}%`;

  return (
    <motion.div
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
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
        {skill.description}
      </p>
      <ul className="space-y-2 mb-6">
        {skill.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400"
          >
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs mb-1">
          <span>Proficiência</span>
          <span className="font-bold text-blue-500">{level}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: level }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
  ariaLabel,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
        active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'bg-gray-200/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
      }`}
    >
      {label}
    </button>
  );
}

function ProjectCard({
  project,
  index,
  labels,
  onOpen,
}: {
  project: Project;
  index: number;
  labels: { code: string; demo: string };
  onOpen: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all flex flex-col h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="absolute top-4 right-4 z-10">
        <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
          {project.impact}
        </span>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex gap-2 mb-6 flex-wrap">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-800/50"
            >
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
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-xs font-black hover:text-blue-600 transition-colors"
          >
            <Github className="w-4 h-4" />
            {labels.code}
          </a>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-xs font-black hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {labels.demo}
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function Footer({
  t,
  showForm,
  onShowForm,
}: {
  t: ReturnType<typeof useLanguage>['t'];
  showForm: boolean;
  onShowForm: (value: boolean) => void;
}) {
  return (
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
              type="button"
              onClick={() => onShowForm(true)}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <span>{t.footer.cta}</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          ) : (
            <div className="max-w-2xl mx-auto w-full">
              <QuoteForm onSuccess={() => onShowForm(false)} />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <SocialLink
              href="https://github.com/getcode7"
              icon={<Github className="w-6 h-6" />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com/in/getcode7"
              icon={<Linkedin className="w-6 h-6" />}
              label="LinkedIn"
            />
            <SocialLink
              href="mailto:ecleber.dev@outlook.com"
              icon={<Mail className="w-6 h-6" />}
              label="Email"
            />
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
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {icon}
    </a>
  );
}