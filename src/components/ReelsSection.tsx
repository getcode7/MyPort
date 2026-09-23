'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ReelCard, type ReelData } from './ReelCard';
import { useLanguage } from '@/hooks/useLanguage';

// ============================================
// TIPAGEM
// ============================================

interface ReelsApiResponse {
  reels: ReelData[];
  total: number;
  hasMore: boolean;
  page: number;
}

interface ReelItem extends ReelData {
  page: number;
}

// ============================================
// CONSTANTES
// ============================================

const SEEN_REELS_KEY = 'seenReels';
const MAX_SEEN_IDS = 300;

/** Percentagem do lote a partir da qual se pré-carrega o próximo */
const PREFETCH_TRIGGER_RATIO = 0.5;

const SECTION_TEXTS = {
  pt: {
    title: '📹 Aprende em 60 Segundos',
    subtitle: 'Scroll para ver curiosidades educativas',
    loading: 'A carregar vídeos...',
    loadingMore: 'A carregar mais vídeos...',
    emptyTitle: 'Nenhum vídeo disponível',
    emptySubtitle: 'Tenta novamente mais tarde.',
    errorTitle: 'Erro ao carregar vídeos',
    errorSubtitle: 'Tenta novamente mais tarde.',
    query: 'curiosidades educativas',
  },
  en: {
    title: '📹 Learn in 60 Seconds',
    subtitle: 'Scroll to see educational curiosities',
    loading: 'Loading videos...',
    loadingMore: 'Loading more videos...',
    emptyTitle: 'No videos available',
    emptySubtitle: 'Please try again later.',
    errorTitle: 'Error loading videos',
    errorSubtitle: 'Please try again later.',
    query: 'educational curiosities',
  },
} as const;

// ============================================
// LOCALSTORAGE
// ============================================

function getSeenIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SEEN_REELS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSeenIds(ids: string[]): void {
  if (typeof window === 'undefined' || ids.length === 0) return;
  try {
    const current = new Set(getSeenIds());
    for (const id of ids) current.add(id);

    const updated = Array.from(current).slice(-MAX_SEEN_IDS);
    localStorage.setItem(SEEN_REELS_KEY, JSON.stringify(updated));
  } catch {
    // Ignora falhas
  }
}

// ============================================
// COMPONENTE
// ============================================

export function ReelsSection() {
  const { language } = useLanguage();
  const texts = SECTION_TEXTS[language] ?? SECTION_TEXTS.pt;

  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prefetchRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Mantém a ref sincronizada com o estado
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // ============================================
  // FETCH
  // ============================================

  const fetchPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (isLoadingMoreRef.current) return;
      if (!replace && !hasMoreRef.current) return;

      isLoadingMoreRef.current = true;

      if (replace) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setHasError(false);

      try {
        const seenIds = getSeenIds();
        const params = new URLSearchParams({
          q: texts.query,
          page: String(pageToLoad),
        });

        if (seenIds.length > 0) {
          params.set('exclude', seenIds.join(','));
        }

        const response = await fetch(`/api/reels?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const data: ReelsApiResponse = await response.json();
        const newReels: ReelItem[] = (data.reels ?? []).map((reel) => ({
          ...reel,
          page: pageToLoad,
        }));

        setReels((prev) => (replace ? newReels : [...prev, ...newReels]));
        setHasMore(Boolean(data.hasMore));
        setPage(pageToLoad);
      } catch (error) {
        console.error('Erro ao carregar reels:', error);
        setHasError(true);
        if (replace) setReels([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    },
    [texts.query]
  );

  // Primeira página
  useEffect(() => {
    setReels([]);
    setPage(1);
    setHasMore(true);
    hasMoreRef.current = true;
    fetchPage(1, true);
  }, [fetchPage]);

  // ============================================
  // PRÉ-CARREGAMENTO NO MEIO DO LOTE
  // ============================================

  useEffect(() => {
    const trigger = prefetchRef.current;
    const container = scrollContainerRef.current;
    if (!trigger || !container || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMoreRef.current &&
          hasMoreRef.current
        ) {
          fetchPage(page + 1, false);
        }
      },
      {
        root: container,
        // Dispara quando o trigger está a 300px do fundo do viewport
        rootMargin: '0px 0px 300px 0px',
        threshold: 0,
      }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [page, hasMore, fetchPage, reels.length]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleReelVisible = useCallback((id: string) => {
    addSeenIds([id]);
  }, []);

  // ============================================
  // CÁLCULO DO TRIGGER
  // ============================================

  // Índice onde colocamos o trigger de pré-carregamento (meio do lote)
  const triggerIndex = Math.max(
    1,
    Math.floor(reels.length * PREFETCH_TRIGGER_RATIO) - 1
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <section id="reels" className="relative bg-black">
      <header className="sticky top-0 z-20 bg-gradient-to-b from-black to-transparent py-6 text-center pointer-events-none">
        <h2 className="text-white text-2xl md:text-3xl font-black">
          {texts.title}
        </h2>
        <p className="text-white/60 text-sm mt-1">{texts.subtitle}</p>
      </header>

      {isLoading && (
        <div className="h-screen flex items-center justify-center text-white">
          <p className="text-lg">{texts.loading}</p>
        </div>
      )}

      {!isLoading && hasError && reels.length === 0 && (
        <div className="h-screen flex items-center justify-center text-white text-center px-6">
          <div>
            <p className="text-lg mb-2">⚠️ {texts.errorTitle}</p>
            <p className="text-sm text-white/60">{texts.errorSubtitle}</p>
          </div>
        </div>
      )}

      {!isLoading && !hasError && reels.length === 0 && (
        <div className="h-screen flex items-center justify-center text-white text-center px-6">
          <div>
            <p className="text-lg mb-2">📭 {texts.emptyTitle}</p>
            <p className="text-sm text-white/60">{texts.emptySubtitle}</p>
          </div>
        </div>
      )}

      {!isLoading && reels.length > 0 && (
        <div
          ref={scrollContainerRef}
          className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        >
          {reels.map((reel, index) => (
            <div key={`${reel.page}-${reel.id}`}>
              {/* Trigger invisível no meio do lote */}
              {index === triggerIndex && hasMore && (
                <div ref={prefetchRef} className="h-0 w-0" aria-hidden="true" />
              )}

              <ReelCard
                reel={reel}
                language={language as 'pt' | 'en'}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onVisible={handleReelVisible}
              />
            </div>
          ))}

          {isLoadingMore && (
            <div className="h-16 flex items-center justify-center text-white/60 text-sm">
              {texts.loadingMore}
            </div>
          )}

          {!hasMore && (
            <div className="h-16 flex items-center justify-center text-white/40 text-xs">
              — fim —
            </div>
          )}
        </div>
      )}
    </section>
  );
}