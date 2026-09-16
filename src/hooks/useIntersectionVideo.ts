'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================
// TIPAGEM
// ============================================

interface UseIntersectionVideoOptions {
  /** Proporção mínima visível para considerar o vídeo ativo (0–1) */
  threshold?: number;
  /** Se `true`, o observer para de observar após a primeira interseção */
  once?: boolean;
}

interface UseIntersectionVideoReturn {
  /** Ref a colocar no elemento a observar */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Indica se o elemento está visível o suficiente para reproduzir */
  isVisible: boolean;
}

// ============================================
// CONSTANTES
// ============================================

/** Proporção padrão para considerar o vídeo ativo */
const DEFAULT_THRESHOLD = 0.6;

// ============================================
// HOOK
// ============================================

/**
 * Deteta se um elemento está visível no ecrã com base num threshold.
 *
 * Útil para autoplay/pause de vídeos (ex: iframes do YouTube)
 * consoante a visibilidade do elemento.
 */
export function useIntersectionVideo(
  options: UseIntersectionVideoOptions = {}
): UseIntersectionVideoReturn {
  const { threshold = DEFAULT_THRESHOLD, once = false } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Se o browser não suportar IntersectionObserver, considera sempre visível
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= threshold;

        setIsVisible(visible);

        // Se `once` estiver ativo, para de observar após a primeira interseção
        if (once && visible) {
          observer.disconnect();
        }
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once]);

  return { containerRef, isVisible };
}