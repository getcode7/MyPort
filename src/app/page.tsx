'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Terminal,
  Database,
  Layers,
  Award,
  Target,
  Code2,
  Sparkles
} from 'lucide-react';
import { Hero } from '@/components/Hero';

// ============================================
// DADOS PERSONALIZADOS - Ecleber Monteiro
// ============================================

const PROJECTS = [
  {
    title: "Sistema de Gestão Inteligente",
    description: "Desenvolvido como projeto final de curso, utiliza IA para otimização de recursos em tempo real. Foco em performance e processamento eficiente de dados.",
    tech: ["React", "Node.js", "Python", "PostgreSQL"],
    link: "#",
    github: "https://github.com/getcode7",
    impact: "🏆 Projeto de destaque acadêmico",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "E-commerce de Alta Performance",
    description: "Plataforma escalável com foco em UX e otimização de performance. Implementação de lazy loading e assets otimizados para melhor experiência.",
    tech: ["Next.js", "Tailwind CSS", "TypeScript", "Prisma"],
    link: "#",
    github: "https://github.com/getcode7",
    impact: "⚡ Performance otimizada",
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "API de Microserviços",
    description: "Arquitetura robusta para processamento de dados utilizando Docker e Kubernetes. Projeto demonstrando conhecimentos em escalabilidade e cloud.",
    tech: ["Go", "Docker", "Redis", "gRPC"],
    link: "#",
    github: "https://github.com/getcode7",
    impact: "☁️ Arquitetura moderna",
    color: "from-green-500 to-teal-600"
  }
];

const SKILLS = [
  { 
    name: "Frontend", 
    icon: <Globe className="w-5 h-5" />, 
    items: ["React", "Next.js", "TypeScript", "Tailwind"],
    level: "85%",
    description: "Criação de interfaces responsivas e performáticas"
  },
  { 
    name: "Backend", 
    icon: <Terminal className="w-5 h-5" />, 
    items: ["Node.js", "Python", "Java", "Go"],
    level: "75%",
    description: "APIs eficientes e escaláveis"
  },
  { 
    name: "Database", 
    icon: <Database className="w-5 h-5" />, 
    items: ["PostgreSQL", "MongoDB", "Redis"],
    level: "70%",
    description: "Modelagem e otimização de queries"
  },
  { 
    name: "DevOps", 
    icon: <Layers className="w-5 h-5" />, 
    items: ["Docker", "Git", "CI/CD", "AWS Básico"],
    level: "65%",
    description: "Automação e versionamento"
  }
];

// Soft Skills destacadas para recrutadores
const SOFT_SKILLS = [
  { name: "Responsabilidade", icon: <Target className="w-5 h-5" />, description: "Compromisso com prazos e qualidade" },
  { name: "Confiabilidade", icon: <Award className="w-5 h-5" />, description: "Entrega consistente e transparente" },
  { name: "Profissionalismo", icon: <Sparkles className="w-5 h-5" />, description: "Comunicação clara e postura ética" },
  { name: "Performance Focus", icon: <Code2 className="w-5 h-5" />, description: "Otimização constante e boas práticas" }
];

// Experiência e Formação
const EXPERIENCES = [
  {
    company: "Projetos Acadêmicos & Pessoais",
    role: "Desenvolvedor Full Stack (Projetos Próprios)",
    period: "2023 - Presente",
    achievements: [
      "Desenvolvimento de projetos completos utilizando React, Node.js e PostgreSQL",
      "Implementação de práticas de performance otimizando tempo de carregamento",
      "Utilização de Git e GitHub para versionamento e colaboração",
      "Criação de aplicações responsivas com foco em experiência do usuário"
    ]
  },
  {
    company: "Formação Acadêmica",
    role: "Engenharia Informática",
    period: "2019 - 2024",
    achievements: [
      "Conclusão do curso com projetos práticos em desenvolvimento web e mobile",
      "Desenvolvimento de projeto final: Sistema de Gestão Inteligente com IA",
      "Participação em workshops e hackathons de tecnologia",
      "Foco em arquitetura de software e boas práticas de desenvolvimento"
    ]
  }
];

// Estatísticas personalizadas
const STATS = [
  { value: "4+", label: "Anos de Estudo em TI", icon: "🎓" },
  { value: "15+", label: "Projetos Desenvolvidos", icon: "💻" },
  { value: "8+", label: "Tecnologias Dominadas", icon: "🚀" },
  { value: "100%", label: "Dedicação & Foco", icon: "⭐" }
];

export default function Home() {
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

      {/* Conteúdo com Z-index superior */}
      <div className="relative z-10">
        
        {/* HERO COMPLETO PERSONALIZADO */}
        <Hero />

        {/* Seção de Estatísticas Personalizadas */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Soft Skills - DESTAQUE PARA RECRUTADORES */}
        <section className="py-20 bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-500/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">Soft Skills em Destaque</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                O que me diferencia e agrega valor à sua equipe
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SOFT_SKILLS.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2">{skill.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Experiência e Formação */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-black mb-4 tracking-tight">Trajetória & Formação</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Minha jornada no mundo da tecnologia
              </p>
            </div>

            <div className="space-y-8">
              {EXPERIENCES.map((exp, idx) => (
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
                      <span className="text-sm font-bold text-gray-500 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <span className="text-blue-500 mt-1">▹</span>
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section com foco em Performance */}
        <section className="py-32" id="skills">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">Expertise Técnica</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Tecnologias que domino com <span className="text-blue-500 font-bold">foco em performance</span>
                </p>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600 to-transparent hidden md:block mb-4 ml-10 opacity-30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SKILLS.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-[2rem] border border-white/50 dark:border-gray-800/50 hover:border-blue-500/50 transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2">{skill.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{skill.description}</p>
                  <ul className="space-y-2 mb-6">
                    {skill.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* Barra de proficiência */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Proficiência</span>
                      <span className="font-bold text-blue-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: skill.level }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-32" id="projects">
          <div className="max-w-5xl mx-auto px-6">
            <div className="mb-20">
              <h2 className="text-4xl font-black mb-4 tracking-tight">Projetos em Destaque</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Uma amostra do meu trabalho com <span className="text-purple-500 font-bold">foco em resultados</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {PROJECTS.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all"
                >
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                      {project.impact}
                    </span>
                  </div>
                  <div className="p-10">
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {project.tech.map(t => (
                        <span key={t} className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-800/50">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-black mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex gap-6">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black hover:text-blue-600 transition-colors">
                        <Github className="w-5 h-5" /> SOURCE CODE
                      </a>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-black hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-5 h-5" /> LIVE DEMO
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer / Contact - COMPLETAMENTE PERSONALIZADO */}
        <footer className="py-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 pointer-events-none" />
              
              {/* Badge de disponibilidade */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-6 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold">🇵🇹 Lisboa, Portugal - Disponível para oportunidades</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black mb-6 relative z-10 tracking-tighter">
                Vamos criar algo <br /> extraordinário juntos?
              </h2>
              
              <p className="text-gray-300 dark:text-gray-600 mb-10 relative z-10 max-w-lg mx-auto font-medium">
                &ldquo;Código eficiente, resultados extraordinários.&rdquo; - Ecleber Monteiro
              </p>
              
              <p className="text-gray-300 dark:text-gray-600 mb-10 relative z-10 max-w-lg mx-auto text-sm">
                Em busca da primeira oportunidade profissional para aplicar meus conhecimentos, 
                crescer e agregar valor à sua equipe com responsabilidade, confiança e profissionalismo.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <a href="mailto:eclebermonteiro26@gmail.com" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl inline-flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  ENVIAR EMAIL
                </a>
                <a  href="https://www.linkedin.com/in/ecleber-araújo" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 
               text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-black
               bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30
               px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all inline-flex items-center gap-2">
                  <Linkedin className="w-5 h-5" />
                  CONECTAR NO LINKEDIN
                </a>
                <a href="https://github.com/getcode7" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400
               text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-black
               bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30
               px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all inline-flex items-center gap-2"
  >
                  <Github className="w-5 h-5" />
                  VER GITHUB
                </a>
              </div>
            </motion.div>
            
            <p className="mt-20 text-gray-400 font-bold tracking-widest uppercase text-[10px]">
              © {new Date().getFullYear()} Ecleber Monteiro • Engenharia Informática • Lisboa, Portugal
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}