'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Volume2, VolumeX } from 'lucide-react';
import { useIntersectionVideo } from '@/hooks/useIntersectionVideo';

// ============================================
// TIPAGEM
// ============================================

export interface ReelData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  tags?: string[];
  likes?: number;
}

interface ReelCardProps {
  reel: ReelData;
  language: 'pt' | 'en';
  isMuted: boolean;
  onToggleMute: () => void;
}

// ============================================
// CONSTANTES
// ============================================

/** Parâmetros do embed do YouTube */
const YOUTUBE_EMBED_PARAMS = {
  autoplay: '1',
  loop: '1',
  controls: '0',
  modestbranding: '1',
  rel: '0',
  playsinline: '1',
} as const;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Constrói o URL do iframe do YouTube com os parâmetros corretos.
 */
function buildEmbedUrl(
  embedUrl: string,
  videoId: string,
  isMuted: boolean
): string {
  const params = new URLSearchParams({
    ...YOUTUBE_EMBED_PARAMS,
    mute: isMuted ? '1' : '0',
    playlist: videoId,
  });

  return `${embedUrl}?${params.toString()}`;
}

/**
 * Devolve o estilo do container do vídeo (9:16 responsivo).
 */
function getVideoContainerStyle(): React.CSSProperties {
  return {
    width: 'min(90vh * 9 / 16, 420px, 90vw)',
    height: 'min(90vh, 90vw * 16 / 9)',
    aspectRatio: '9 / 16',
  };
}

// ============================================
// COMPONENTE
// ============================================

export const ReelCard = memo(function ReelCard({
  reel,
  isMuted,
  onToggleMute,
}: ReelCardProps) {
  const { containerRef, isVisible } = useIntersectionVideo();

  const embedSrc = buildEmbedUrl(reel.embedUrl, reel.id, isMuted);
  const iframeKey = `${reel.id}-${isMuted ? 'muted' : 'unmuted'}`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-screen flex-shrink-0 snap-start flex items-center justify-center bg-black"
    >
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
        style={getVideoContainerStyle()}
      >
        {/* Vídeo (iframe) ou thumbnail de pré-visualização */}
        {isVisible ? (
          <iframe
            key={iframeKey}
            src={embedSrc}
            title={reel.title}
            className="absolute inset-0 w-full h-full pointer-events-none"
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reel.thumbnail}
            alt={reel.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}

        {/* Gradiente para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Botão de som */}
        <button
          type="button"
          onClick={onToggleMute}
          className="absolute top-3 right-3 z-30 bg-white/20 backdrop-blur-md rounded-full p-2.5 hover:bg-white/30 transition pointer-events-auto"
          aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" aria-hidden="true" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" aria-hidden="true" />
          )}
        </button>

        {/* Informação do vídeo */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white pointer-events-none z-20">
          <h3 className="text-base font-bold mb-1 line-clamp-2">
            {reel.title}
          </h3>
          <p className="text-xs text-white/80 line-clamp-2">
            {reel.description}
          </p>
        </div>

        {/* Ações laterais */}
        <div className="absolute right-3 bottom-20 flex flex-col gap-4 z-20 pointer-events-auto">
          <ActionButton
            icon={<Heart className="w-5 h-5" />}
            label={String(reel.likes ?? 0)}
            ariaLabel="Gostar"
          />
          <ActionButton
            icon={<Share2 className="w-5 h-5" />}
            label="Share"
            ariaLabel="Partilhar"
          />
        </div>
      </div>
    </motion.div>
  );
});

// ============================================
// SUB-COMPONENTES
// ============================================

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
}

const ActionButton = memo(function ActionButton({
  icon,
  label,
  ariaLabel,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex flex-col items-center text-white hover:scale-110 transition"
    >
      <div className="bg-white/20 backdrop-blur-md rounded-full p-2.5">
        {icon}
      </div>
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
});