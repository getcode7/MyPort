'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReelCard, type ReelData } from './ReelCard';

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

interface ReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  language: 'pt' | 'en';
  onReelVisible: (id: string) => void;
}

// ============================================
// CONSTANTES
// ============================================

const PREFETCH_TRIGGER_RATIO = 0.5;

const MODAL_TEXTS = {
  pt: {
    close: 'Fechar',
    loading: 'A carregar vídeos...',
    loadingMore: 'A carregar mais...',
    empty: 'Nenhum vídeo disponível',
    error: 'Erro ao carregar vídeos',
    end: '— fim —',
  },
  en: {
    close: 'Close',
    loading: 'Loading videos...',
    loadingMore: 'Loading more...',
    empty: 'No videos available',
    error: 'Error loading videos',
    end: '— end —',
  },
} as const;

// ============================================
// COMPONENTE
// ============================================

export function ReelsModal({
  isOpen,
  onClose,
  query,
  language,
  onReelVisible,
}: ReelsModalProps) {
  const texts = MODAL_TEXTS[language] ?? MODAL_TEXTS.pt;

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

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Bloquear scroll do body
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // ============================================
  // FETCH
  // ============================================

  const fetchPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      if (isLoadingMoreRef.current) return;
      if (!replace && !hasMoreRef.current) return;

      isLoadingMoreRef.current = true;

      if (replace) setIsLoading(true);
      else setIsLoadingMore(true);
      setHasError(false);

      try {
        const params = new URLSearchParams({
          q: query,
          page: String(pageToLoad),
        });

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
    [query]
  );

  useEffect(() => {
    if (!isOpen) return;
    setReels([]);
    setPage(1);
    setHasMore(true);
    hasMoreRef.current = true;
    fetchPage(1, true);
  }, [isOpen, fetchPage]);

  // ============================================
  // PREFETCH
  // ============================================

  useEffect(() => {
    if (!isOpen) return;

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
        rootMargin: '0px 0px 300px 0px',
        threshold: 0,
      }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [isOpen, page, hasMore, fetchPage, reels.length]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const triggerIndex = Math.max(
    1,
    Math.floor(reels.length * PREFETCH_TRIGGER_RATIO) - 1
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black"
          role="dialog"
          aria-modal="true"
        >
          {/* Botão fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-white/10 backdrop-blur-md rounded-full p-2.5 hover:bg-white/20 transition"
            aria-label={texts.close}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {isLoading && (
            <div className="h-full flex items-center justify-center text-white">
              <p className="text-lg">{texts.loading}</p>
            </div>
          )}

          {!isLoading && hasError && reels.length === 0 && (
            <div className="h-full flex items-center justify-center text-white">
              <p className="text-lg">⚠️ {texts.error}</p>
            </div>
          )}

          {!isLoading && !hasError && reels.length === 0 && (
            <div className="h-full flex items-center justify-center text-white">
              <p className="text-lg">📭 {texts.empty}</p>
            </div>
          )}

          {!isLoading && reels.length > 0 && (
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
            >
              {reels.map((reel, index) => (
                <div key={`${reel.page}-${reel.id}`}>
                  {index === triggerIndex && hasMore && (
                    <div ref={prefetchRef} className="h-0 w-0" aria-hidden="true" />
                  )}

                  <ReelCard
                    reel={reel}
                    language={language}
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                    onVisible={onReelVisible}
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
                  {texts.end}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}