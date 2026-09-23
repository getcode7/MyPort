export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// ============================================================================
// CONSTANTES
// ============================================================================

const YOUTUBE_CATEGORY_EDUCATION = '27';
const VIDEO_DURATION_SHORT = 'short';
const MAX_RESULTS = 12;
const RESULTS_PER_QUERY = 20;
const MAX_EXCLUDED_IDS = 300;
const FETCH_TIMEOUT_MS = 8000;
const QUERIES_PER_REQUEST = 5;

const EDUCATIONAL_QUERIES = [
  // PT
  'curiosidades educativas',
  'factos curiosos',
  'aprender ciência',
  'história explicada',
  'descobertas científicas',
  'mundo animal',
  'espaço e astronomia',
  'como funciona',
  'conhecimento geral',
  'factos interessantes',
  // EN
  'educational facts',
  'fun science facts',
  'learn something new',
  'quick history',
  'amazing science',
  'nature documentary shorts',
  'space facts',
  'how things work',
  'interesting facts',
  'science explained',
  // ES
  'datos curiosos',
  'aprender español',
  'ciencia divertida',
  'historia para niños',
  'datos interesantes',
] as const;

const EDUCATIONAL_KEYWORDS = [
  // PT
  'educação', 'educativo', 'educativa', 'aprender', 'aprenda',
  'tutorial', 'explicação', 'explicado', 'explicada', 'curiosidade',
  'curiosidades', 'ciência', 'científico', 'científica', 'história',
  'descoberta', 'descobertas', 'conhecimento', 'como funciona',
  // EN
  'education', 'educational', 'learn', 'learning', 'tutorial',
  'explained', 'explanation', 'curiosity', 'curious', 'science',
  'scientific', 'history', 'discovery', 'discoveries', 'knowledge',
  'how it works',
  // ES
  'educativo', 'educativa', 'aprender', 'aprende', 'tutorial',
  'explicación', 'curiosidades', 'ciencia', 'científica', 'historia',
  'descubrimiento', 'conocimiento',
] as const;

// ============================================================================
// TIPAGEM
// ============================================================================

interface YouTubeThumbnail {
  url: string;
}

interface YouTubeSnippet {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    high?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    default?: YouTubeThumbnail;
  };
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: YouTubeSnippet;
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
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

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/** Fisher-Yates shuffle */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Escolhe `count` queries distintas de forma aleatória */
function pickRandomQueries(count: number): string[] {
  return shuffle(EDUCATIONAL_QUERIES).slice(0, count);
}

/** Remove tags HTML e normaliza espaços */
function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** Verifica se um vídeo é educativo com base nas palavras-chave */
function isEducationalVideo(item: YouTubeSearchItem): boolean {
  const title = item.snippet?.title ?? '';
  const description = item.snippet?.description ?? '';
  const haystack = `${title} ${description}`.toLowerCase();

  return EDUCATIONAL_KEYWORDS.some((keyword) =>
    haystack.includes(keyword.toLowerCase())
  );
}

/** Converte um item da YouTube API para o formato Reel */
function mapToReel(item: YouTubeSearchItem): Reel {
  const thumbnails = item.snippet?.thumbnails ?? {};

  return {
    id: item.id.videoId,
    title: sanitizeText(item.snippet?.title ?? ''),
    description: sanitizeText(item.snippet?.description ?? ''),
    thumbnail:
      thumbnails.high?.url ??
      thumbnails.medium?.url ??
      thumbnails.default?.url ??
      '',
    channelTitle: sanitizeText(item.snippet?.channelTitle ?? ''),
    publishedAt: item.snippet?.publishedAt ?? '',
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}`,
    tags: [],
    likes: 0,
  };
}

/** Constrói a URL da YouTube Data API v3 */
function buildYouTubeUrl(query: string, apiKey: string): string {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');

  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoCategoryId', YOUTUBE_CATEGORY_EDUCATION);
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('maxResults', String(RESULTS_PER_QUERY));
  url.searchParams.set('relevanceLanguage', 'pt');
  url.searchParams.set('videoDuration', VIDEO_DURATION_SHORT);
  url.searchParams.set('key', apiKey);

  return url.toString();
}

/** Remove reels duplicados pelo ID */
function dedupeReels(reels: Reel[]): Reel[] {
  const seen = new Set<string>();
  return reels.filter((reel) => {
    if (!reel.id || seen.has(reel.id)) return false;
    seen.add(reel.id);
    return true;
  });
}

/**
 * Extrai os IDs a excluir do parâmetro `?exclude=id1,id2,...`.
 * Limita a `MAX_EXCLUDED_IDS` para evitar abusos.
 */
function parseExcludedIds(searchParams: URLSearchParams): Set<string> {
  const raw = searchParams.get('exclude');
  if (!raw) return new Set();

  const ids = raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, MAX_EXCLUDED_IDS);

  return new Set(ids);
}

/** Executa um fetch com timeout */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

/** Busca vídeos para uma query. Devolve `[]` em caso de erro. */
async function searchYouTube(
  query: string,
  apiKey: string
): Promise<YouTubeSearchItem[]> {
  try {
    const response = await fetchWithTimeout(
      buildYouTubeUrl(query, apiKey),
      FETCH_TIMEOUT_MS
    );

    if (!response.ok) {
      console.error(
        `YouTube API error ${response.status} para query "${query}"`
      );
      return [];
    }

    const data = (await response.json()) as YouTubeSearchResponse;

    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.error(`Falha na query "${query}":`, error);
    return [];
  }
}

// ============================================================================
// HANDLER
// ============================================================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const customQuery = searchParams.get('q');
  const excludedIds = parseExcludedIds(searchParams);

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('YOUTUBE_API_KEY não configurada.');
    return NextResponse.json(
      { error: 'Configuração do servidor incompleta.' },
      { status: 500 }
    );
  }

  try {
    const queries = customQuery
      ? [customQuery]
      : pickRandomQueries(QUERIES_PER_REQUEST);

    // Pedidos em paralelo
    const results = await Promise.all(
      queries.map((query) => searchYouTube(query, apiKey))
    );

    const allItems = results.flat();

    // Filtrar, converter e remover duplicados
    const uniqueReels = dedupeReels(
      allItems.filter(isEducationalVideo).map(mapToReel)
    );

    // Remover vídeos já vistos
    const freshReels = uniqueReels.filter(
      (reel) => !excludedIds.has(reel.id)
    );

    const usedFallback = freshReels.length < MAX_RESULTS;

    const pool = usedFallback
      ? [...freshReels, ...shuffle(uniqueReels)]
      : freshReels;

    const reels = shuffle(pool).slice(0, MAX_RESULTS);

    return NextResponse.json(
      {
        reels,
        total: reels.length,
        meta: {
          queries,
          found: allItems.length,
          unique: uniqueReels.length,
          excluded: excludedIds.size,
          usedFallback,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar pedido de reels:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar o pedido.' },
      { status: 500 }
    );
  }
}