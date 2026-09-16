'use client';

import { useCallback, useEffect, useState } from 'react';
import { ReelCard, type ReelData } from './ReelCard';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================
// TIPAGEM
// ============================================

interface ReelsApiResponse {
  reels: ReelData[];
  total: number;
}

// ============================================
// CONSTANTES
// ============================================

/** Textos traduzidos da secção */
const SECTION_TEXTS = {
  pt: {
    title: '📹 Aprende em 60 Segundos',
    subtitle: 'Scroll para ver curiosidades educativas',
    loading: 'A carregar vídeos...',
    emptyTitle: 'Nenhum vídeo disponível',
    emptySubtitle: 'Verifica a configuração e tenta novamente.',
    errorTitle: 'Erro ao carregar vídeos',
    errorSubtitle: 'Tenta novamente mais tarde.',
    query: 'curiosidades educativas',
  },
  en: {
    title: '📹 Learn in 60 Seconds',
    subtitle: 'Scroll to see educational curiosities',
    loading: 'Loading videos...',
    emptyTitle: 'No videos available',
    emptySubtitle: 'Check the configuration and try again.',
    errorTitle: 'Error loading videos',
    errorSubtitle: 'Please try again later.',
    query: 'educational curiosities',
  },
} as const;

// ============================================
// COMPONENTE
// ============================================

export function ReelsSection() {
  const { language } = useLanguage();
  const texts = SECTION_TEXTS[language] ?? SECTION_TEXTS.pt;

  const [reels, setReels] = useState<ReelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Estado do som partilhado entre todos os cards
  const [isMuted, setIsMuted] = useState(true);

  // ============================================
  // EFEITOS
  // ============================================

  useEffect(() => {
    let isCancelled = false;

    async function fetchReels() {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(
          `/api/reels?q=${encodeURIComponent(texts.query)}`
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const data: ReelsApiResponse = await response.json();

        if (!isCancelled) {
          setReels(Array.isArray(data.reels) ? data.reels : []);
        }
      } catch (error) {
        console.error('Erro ao carregar reels:', error);
        if (!isCancelled) {
          setHasError(true);
          setReels([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchReels();

    return () => {
      isCancelled = true;
    };
  }, [texts.query]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <section id="reels" className="relative bg-black">
      {/* Cabeçalho fixo */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-black to-transparent py-6 text-center pointer-events-none">
        <h2 className="text-white text-2xl md:text-3xl font-black">
          {texts.title}
        </h2>
        <p className="text-white/60 text-sm mt-1">{texts.subtitle}</p>
      </header>

      {/* Conteúdo */}
      {isLoading && <LoadingState message={texts.loading} />}

      {!isLoading && hasError && (
        <ErrorState
          title={texts.errorTitle}
          subtitle={texts.errorSubtitle}
        />
      )}

      {!isLoading && !hasError && reels.length === 0 && (
        <EmptyState
          title={texts.emptyTitle}
          subtitle={texts.emptySubtitle}
        />
      )}

      {!isLoading && !hasError && reels.length > 0 && (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
          {reels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              language={language as 'pt' | 'en'}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================
// SUB-COMPONENTES DE ESTADO
// ============================================

interface StateProps {
  title: string;
  subtitle: string;
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="h-screen flex items-center justify-center text-white">
      <p className="text-lg">{message}</p>
    </div>
  );
}

function ErrorState({ title, subtitle }: StateProps) {
  return (
    <div className="h-screen flex items-center justify-center text-white text-center px-6">
      <div>
        <p className="text-lg mb-2">⚠️ {title}</p>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: StateProps) {
  return (
    <div className="h-screen flex items-center justify-center text-white text-center px-6">
      <div>
        <p className="text-lg mb-2">📭 {title}</p>
        <p className="text-sm text-white/60">{subtitle}</p>
      </div>
    </div>
  );
}