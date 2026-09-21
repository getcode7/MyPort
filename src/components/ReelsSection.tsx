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
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  // ============================================
  // FETCH
  // ============================================

  const fetchPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (isLoadingMoreRef.current) return;
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

  // Carrega primeira página
  useEffect(() => {
    setReels([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
  }, [fetchPage]);

  // ============================================
  // SCROLL INFINITO (IntersectionObserver no sentinel)
  // ============================================

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMoreRef.current && hasMore) {
          fetchPage(page + 1, false);
        }
      },
      { root: scrollContainerRef.current, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, hasMore, fetchPage]);

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
          {reels.map((reel) => (
            <ReelCard
              key={`${reel.page}-${reel.id}`}
              reel={reel}
              language={language as 'pt' | 'en'}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onVisible={handleReelVisible}
            />
          ))}

          {/* Sentinel para scroll infinito */}
          <div ref={sentinelRef} className="h-4 w-full" />

          {isLoadingMore && (
            <div className="h-16 flex items-center justify-center text-white/60 text-sm">
              {texts.loadingMore}
            </div>
          )}
        </div>
      )}
    </section>
  );
}