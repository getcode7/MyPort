import { NextResponse } from 'next/server';

// ============================================
// CONSTANTES
// ============================================

/** Categoria oficial de Educação no YouTube */
const YOUTUBE_CATEGORY_EDUCATION = '27';

/** Duração máxima dos vídeos (short = < 4 min) */
const VIDEO_DURATION_SHORT = 'short';

/** Número máximo de resultados por pedido */
const MAX_RESULTS = 12;

/** Query padrão quando não é fornecida */
const DEFAULT_QUERY = 'curiosidades educativas';

/** Termos a filtrar para garantir conteúdo educativo */
const EDUCATIONAL_KEYWORDS = [
  'educação',
  'educativo',
  'aprender',
  'tutorial',
  'explicação',
  'curiosidade',
];

// ============================================
// TIPAGEM
// ============================================

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      high?: { url: string };
      default?: { url: string };
    };
  };
}

interface Reel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  embedUrl: string;
  tags: string[];
  likes: number;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Remove caracteres HTML perigosos de uma string.
 */
function sanitizeText(text: string): string {
  return text.replace(/[<>]/g, '').trim();
}

/**
 * Verifica se um vídeo é considerado educativo.
 */
function isEducationalVideo(item: YouTubeSearchItem): boolean {
  const text = `${item.snippet.title} ${item.snippet.description}`.toLowerCase();
  return EDUCATIONAL_KEYWORDS.some((keyword) => text.includes(keyword));
}

/**
 * Transforma um item da YouTube API no formato Reel.
 */
function mapToReel(item: YouTubeSearchItem): Reel {
  return {
    id: item.id.videoId,
    title: sanitizeText(item.snippet.title),
    description: sanitizeText(item.snippet.description),
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.default?.url ||
      '',
    channelTitle: sanitizeText(item.snippet.channelTitle),
    publishedAt: item.snippet.publishedAt,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}`,
    tags: [],
    likes: 0,
  };
}

/**
 * Constrói a URL da YouTube Data API v3.
 */
function buildYouTubeUrl(query: string, apiKey: string): string {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');

  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoCategoryId', YOUTUBE_CATEGORY_EDUCATION);
  url.searchParams.set('order', 'viewCount');
  url.searchParams.set('maxResults', String(MAX_RESULTS));
  url.searchParams.set('relevanceLanguage', 'pt');
  url.searchParams.set('videoDuration', VIDEO_DURATION_SHORT);
  url.searchParams.set('key', apiKey);

  return url.toString();
}

// ============================================
// HANDLER DA ROTA
// ============================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || DEFAULT_QUERY;

  const apiKey = process.env.YOUTUBE_API_KEY;

  // Validar configuração
  if (!apiKey) {
    console.error('❌ YOUTUBE_API_KEY não configurada');
    return NextResponse.json(
      { error: 'Configuração do servidor incompleta.' },
      { status: 500 }
    );
  }

  try {
    // 1. Pedir vídeos à YouTube API
    const youtubeUrl = buildYouTubeUrl(query, apiKey);
    const response = await fetch(youtubeUrl, {
      headers: { Accept: 'application/json' },
      // Cache de 1 hora no lado do servidor
      next: { revalidate: 3600 },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro na YouTube API:', data.error?.message);
      return NextResponse.json(
        { error: 'Não foi possível obter vídeos neste momento.' },
        { status: response.status }
      );
    }

    // 2. Filtrar apenas conteúdo educativo
    const items: YouTubeSearchItem[] = Array.isArray(data.items) ? data.items : [];
    const reels: Reel[] = items
      .filter(isEducationalVideo)
      .map(mapToReel);

    // 3. Devolver resposta
    return NextResponse.json(
      { reels, total: reels.length },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao buscar vídeos:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar o pedido.' },
      { status: 500 }
    );
  }
}