'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import type { ReelData } from './ReelCard';
import { ReelsModal } from './ReelsModal';
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

// ============================================
// CONSTANTES
// ============================================

const SEEN_REELS_KEY = 'seenReels';
const MAX_SEEN_IDS = 300;
const PREVIEW_COUNT = 3;

const SECTION_TEXTS = {
  pt: {
    impact: '📹 Educativo',
    title: 'Reels Educativos',
    description:
      'Curiosidades educativas em formato rápido. Aprende em 60 segundos com uma experiência de scroll imersiva.',
    cta: 'Ver Reels',
    loading: 'A carregar...',
    query: 'curiosidades educativas',
    tags: ['Vídeo', 'Educação', 'Curiosidades'],
  },
  en: {
    impact: '📹 Educational',
    title: 'Educational Reels',
    description:
      'Educational curiosities in a quick format. Learn in 60 seconds with an immersive scroll experience.',
    cta: 'View Reels',
    loading: 'Loading...',
    query: 'educational curiosities',
    tags: ['Video', 'Education', 'Curiosities'],
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

  const [previewReels, setPreviewReels] = useState<ReelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // ============================================
  // FETCH PREVIEW
  // ============================================

  useEffect(() => {
    let cancelled = false;

    async function fetchPreview() {
      setIsLoading(true);
      try {
        const seenIds = getSeenIds();
        const params = new URLSearchParams({ q: texts.query, page: '1' });

        if (seenIds.length > 0) {
          params.set('exclude', seenIds.join(','));
        }

        const response = await fetch(`/api/reels?${params.toString()}`, {
          cache: 'no-store',
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const data: ReelsApiResponse = await response.json();

        if (!cancelled) {
          setPreviewReels((data.reels ?? []).slice(0, PREVIEW_COUNT));
        }
      } catch (error) {
        console.error('Erro ao carregar preview de reels:', error);
        if (!cancelled) setPreviewReels([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPreview();
    return () => {
      cancelled = true;
    };
  }, [texts.query]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleReelVisible = useCallback((id: string) => {
    addSeenIds([id]);
  }, []);

  // ============================================
  // RENDER — cartão com o mesmo estilo dos projetos
  // ============================================

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={texts.title}
        className="group relative bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[3rem] overflow-hidden border border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all flex flex-col h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {/* Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
            {texts.impact}
          </span>
        </div>

        <div className="p-8 flex flex-col flex-1">
          {/* Tags */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {texts.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100/50 dark:border-blue-800/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Título */}
          <h3 className="text-2xl font-black mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
            {texts.title}
          </h3>

          {/* Descrição */}
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-6 leading-relaxed text-sm flex-1">
            {texts.description}
          </p>

          {/* Miniaturas (3 previews) */}
          {isLoading && (
            <p className="text-xs text-gray-500 mb-4">{texts.loading}</p>
          )}

          {!isLoading && previewReels.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {previewReels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reel.thumbnail}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 right-1 bg-white/20 backdrop-blur-md rounded-full p-1">
                    <Play className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rodapé com CTA */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <span className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
              <Film className="w-4 h-4" />
              {texts.cta}
              <Play className="w-3 h-3 fill-current" />
            </span>
          </div>
        </div>
      </motion.article>

      {/* Modal fullscreen */}
      <ReelsModal
        isOpen={isOpen}
        onClose={handleClose}
        query={texts.query}
        language={language as 'pt' | 'en'}
        onReelVisible={handleReelVisible}
      />
    </>
  );
}