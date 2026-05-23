'use client';

// ============================================================================
// IMPORTS ORGANIZADOS
// ============================================================================
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// ============================================================================
// 1. CONSTANTES E CONFIGURAÇÕES (Centralizadas)
// ============================================================================

/** Configurações de performance e aparência */
const CONFIG = {
  // Configurações de partículas
  particles: {
    baseDensity: 15000,         // Área base para calcular número de partículas
    minSize: 0.5,
    maxSize: 2.5,
    maxSpeed: 0.5,              // Velocidade máxima (positiva e negativa)
  },
  
  // Configurações de conexões entre partículas
  connections: {
    maxDistance: 150,            // Distância máxima para conectar partículas
    lineWidth: 1,
  },
  
  // Configurações de interação do mouse
  mouse: {
    radius: 150,                // Raio de influência do mouse
    forceMultiplier: 2,        // Força de repulsão
  },
  
  // Configurações de cores por tema
  colors: {
    dark: {
      particle: 'rgba(255, 255, 255, 0.3)',
      connection: (opacity: number) => `rgba(255, 255, 255, ${opacity * 0.15})`,
    },
    light: {
      particle: 'rgba(0, 0, 0, 0.4)',
      connection: (opacity: number) => `rgba(0, 0, 0, ${opacity * 0.25})`,
    },
  },
  
  // Configurações de performance
  performance: {
    maxParticles: 1500,         // Limite máximo de partículas
    minParticles: 50,           // Limite mínimo de partículas
  },
} as const;

/** Constantes de tipo para evitar erros */
const DEFAULT_CANVAS_SIZE = { width: 1920, height: 1080 };

// ============================================================================
// 2. TIPAGENS (Type-safe e auto-documentadas)
// ============================================================================

interface ParticleProps {
  canvasWidth: number;
  canvasHeight: number;
  theme: 'light' | 'dark';
}

interface MousePosition {
  x: number;
  y: number;
  radius: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: (canvasWidth: number, canvasHeight: number, mouse: MousePosition) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// ============================================================================
// 3. CLASSE PARTICLE (Encapsulada e otimizada)
// ============================================================================

class ParticleImpl implements Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor({ canvasWidth, canvasHeight, theme }: ParticleProps) {
    // Posição inicial aleatória
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    
    // Tamanho da partícula
    this.size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
    
    // Velocidade aleatória (entre -maxSpeed e +maxSpeed)
    this.speedX = (Math.random() - 0.5) * CONFIG.particles.maxSpeed * 2;
    this.speedY = (Math.random() - 0.5) * CONFIG.particles.maxSpeed * 2;
    
    // Cor baseada no tema
    this.color = theme === 'dark' 
      ? CONFIG.colors.dark.particle 
      : CONFIG.colors.light.particle;
  }

  update(canvasWidth: number, canvasHeight: number, mouse: MousePosition): void {
    // Movimento normal
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around - volta ao outro lado da tela
    if (this.x > canvasWidth) this.x = 0;
    else if (this.x < 0) this.x = canvasWidth;
    
    if (this.y > canvasHeight) this.y = 0;
    else if (this.y < 0) this.y = canvasHeight;

    // Interação com o mouse (repulsão)
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < mouse.radius && distance > 0) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      const forceAmount = force * CONFIG.mouse.forceMultiplier;
      
      this.x -= forceDirectionX * forceAmount;
      this.y -= forceDirectionY * forceAmount;
      
      // Garantir que não saia dos limites após repulsão
      this.x = Math.max(0, Math.min(canvasWidth, this.x));
      this.y = Math.max(0, Math.min(canvasHeight, this.y));
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================================================
// 4. FACTORY FUNCTION (Criação de partículas)
// ============================================================================

const createParticle = (props: ParticleProps): Particle => {
  return new ParticleImpl(props);
};

const createParticles = (
  canvasWidth: number, 
  canvasHeight: number, 
  theme: 'light' | 'dark'
): Particle[] => {
  // Calcular número ideal de partículas baseado na área da tela
  const area = canvasWidth * canvasHeight;
  let particleCount = Math.floor(area / CONFIG.particles.baseDensity);
  
  // Aplicar limites de performance
  particleCount = Math.min(
    CONFIG.performance.maxParticles,
    Math.max(CONFIG.performance.minParticles, particleCount)
  );
  
  const particles: Particle[] = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle({ canvasWidth, canvasHeight, theme }));
  }
  
  return particles;
};

// ============================================================================
// 5. HOOK PERSONALIZADO (Lógica do canvas)
// ============================================================================

interface UseCanvasAnimationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  theme: 'light' | 'dark';
}

const useCanvasAnimation = ({ canvasRef, theme }: UseCanvasAnimationProps) => {
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0, radius: CONFIG.mouse.radius });
  const dimensionsRef = useRef({ width: DEFAULT_CANVAS_SIZE.width, height: DEFAULT_CANVAS_SIZE.height });

  // Função para desenhar conexões entre partículas
  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const { maxDistance, lineWidth } = CONFIG.connections;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          
          // Selecionar cor baseada no tema
          const strokeStyle = theme === 'dark'
            ? CONFIG.colors.dark.connection(opacity)
            : CONFIG.colors.light.connection(opacity);
          
          ctx.strokeStyle = strokeStyle;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }, [theme]);

  // Função de animação principal
  const animate = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensionsRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    
    // Limpar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Atualizar e desenhar partículas
    for (const particle of particles) {
      particle.update(width, height, mouse);
      particle.draw(ctx);
    }
    
    // Desenhar conexões
    drawConnections(ctx, particles);
    
    // Continuar animação
    animationRef.current = requestAnimationFrame(() => animate(ctx));
  }, [drawConnections]);

  // Inicializar partículas
  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = createParticles(width, height, theme);
  }, [theme]);

  // Redimensionar canvas
  const resizeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    dimensionsRef.current = { width, height };
    initParticles(width, height);
  }, [initParticles]);

  // Handler de movimento do mouse
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouseRef.current = {
      x: event.clientX,
      y: event.clientY,
      radius: CONFIG.mouse.radius
    };
  }, []);

  // Handler de saída do mouse
  const handleMouseLeave = useCallback(() => {
    // Reset mouse position quando sai da tela
    mouseRef.current = { 
      x: -1000, 
      y: -1000, 
      radius: CONFIG.mouse.radius 
    };
  }, []);

  // Setup e cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handler de resize com throttle para performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => resizeCanvas(canvas), 100);
    };

    // Configurar eventos
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Inicializar
    resizeCanvas(canvas);
    animate(ctx);

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef, resizeCanvas, handleMouseMove, handleMouseLeave, animate]);

  // Recriar partículas quando o tema mudar
  useEffect(() => {
    const { width, height } = dimensionsRef.current;
    if (width > 0 && height > 0) {
      particlesRef.current = createParticles(width, height, theme);
    }
  }, [theme]);
};

// ============================================================================
// 6. COMPONENTE PRINCIPAL (Otimizado com memo)
// ============================================================================

export const InteractiveBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  // Usar o hook personalizado para gerenciar a animação
  useCanvasAnimation({ canvasRef, theme });

  // Memoizar classes CSS para evitar recriação
  const canvasClasses = useMemo(() => 
    "fixed inset-0 pointer-events-none will-change-transform",
    []
  );

  return (
    <canvas
      ref={canvasRef}
      className={canvasClasses}
      aria-hidden="true"
      style={{ 
        opacity: 1,
        zIndex: 9999,
      }}
    />
  );
});

InteractiveBackground.displayName = 'InteractiveBackground';

// ============================================================================
// 7. EXPORTS ADICIONAIS (Para testes ou componentes relacionados)
// ============================================================================

export { CONFIG as InteractiveBackgroundConfig };
export type { Particle, MousePosition };