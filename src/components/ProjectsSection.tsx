'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    title: "Arquitetura de Sistemas Escalável",
    description: "Implementação de arquitetura microserviços com Kubernetes e Docker",
    tags: ["Kubernetes", "Docker", "Go", "PostgreSQL"],
    github: "https://github.com/seu-usuario/projeto1",
    live: "https://projeto1.demo.com",
  },
  {
    title: "Plataforma Full-Stack Moderna",
    description: "Aplicação web completa com React, Node.js e MongoDB",
    tags: ["React", "Node.js", "MongoDB", "WebSocket"],
    github: "https://github.com/seu-usuario/projeto2",
    live: "https://projeto2.demo.com",
  },
  {
    title: "Sistema de Performance em Tempo Real",
    description: "Dashboard de monitoramento com análise de dados em tempo real",
    tags: ["TypeScript", "WebSocket", "Redis", "D3.js"],
    github: "https://github.com/seu-usuario/projeto3",
    live: "https://projeto3.demo.com",
  },
];

export function ProjectsSection() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
            Projetos em Destaque
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Trabalhos recentes que demonstram minha experiência
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}