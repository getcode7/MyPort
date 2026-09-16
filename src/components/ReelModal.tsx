'use client';

import { memo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ReelData } from './ReelCard';

// ============================================
// TIPAGEM
// ============================================

interface ReelModalProps {
  reel: (ReelData & { relatedProject?: string }) | null;
  language: 'pt' | 'en';
  onClose: () => void;
}

// ============================================
// CONSTANTES
// ============================================

/** Parâmetros do embed do YouTube no modal (com som e controlos) */
const YOUTUBE_MODAL_PARAMS = {
  autoplay: '1',
  mute: '0',
  controls: '1',
  modestbranding: '1',
  rel: '0',
  playsinline: '1',
} as const;

/** Textos traduzidos */
const MODAL_TEXTS = {
  pt: {
    close: 'Fechar',
    relatedProject: 'Ver projeto relacionado',
  },
  en: {
    close: 'Close',
    relatedProject: 'View related project',
  },
} as const;

// ============================================
// COMPONENTE
// ============================================

export const ReelModal = memo(function ReelModal({
  reel,
  language,
  onClose,
}: ReelModalProps) {
  const texts = MODAL_TEXTS[language] ?? MODAL_TEXTS.pt;

  // Fechar com tecla Escape
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!reel) return;

    document.addEventListener('keydown', handleKeyDown);
    // Bloquear scroll do body enquanto o modal está aberto
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [reel, handleKeyDown]);

  // Constrói o URL do embed
  const embedSrc = reel
    ? `${reel.embedUrl}?${new URLSearchParams(YOUTUBE_MODAL_PARAMS).toString()}`
    : '';

  return (
    <AnimatePresence>
      {reel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={reel.title}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-white/20 transition"
              aria-label={texts.close}
            >
              <X className="w-5 h-5 text-white" aria-hidden="true" />
            </button>

            {/* Vídeo 9:16 */}
            <div
              className="relative bg-black mx-auto w-full"
              style={{ aspectRatio: '9 / 16', maxHeight: '60vh' }}
            >
              <iframe
                src={embedSrc}
                title={reel.title}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Informação scrollável */}
            <div className="p-5 text-white overflow-y-auto flex-1">
              <h2 className="text-lg font-black mb-2 line-clamp-2">
                {reel.title}
              </h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-4">
                {reel.description}
              </p>

              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {reel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/10 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {reel.relatedProject && (
                <Link
                  href={reel.relatedProject}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm"
                >
                  {texts.relatedProject}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});