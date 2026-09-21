export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

// ============================================
// CONSTANTES
// ============================================

const YOUTUBE_CATEGORY_EDUCATION = '27';
const VIDEO_DURATION_SHORT = 'short';
const RESULTS_PER_PAGE = 12;
const RESULTS_PER_QUERY = 20;
const QUERIES_PER_PAGE = 5;
const MAX_EXCLUDED_IDS = 300;
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGE = 20;

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
  'invenções famosas',
  'mistérios da natureza',
  'curiosidades do oceano',
  'curiosidades sobre o corpo humano',
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
  'famous inventions',
  'nature mysteries',
  'ocean facts',
  'human body facts',
  // ES
  'datos curiosos',
  'aprender español',
  'ciencia divertida',
  'historia para niños',
  'datos interesantes',
  'inventos famosos',
  'misterios de la naturaleza',
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

// ============================================
// TIPAGEM
// ============================================

interface YouTubeThumbnail { url: string; }

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

// ============================================
// UTILITÁRIOS
// ============================================

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Escolhe queries distintas para uma página.
 * Usa o número da página como offset para nunca repetir as mesmas.
 */
function pickQueriesForPage(page: number): string[] {
  const shuffled = shuffle(EDUCATIONAL_QUERIES);
  const offset = ((page - 1) * QUERIES_PER_PAGE) % shuffled.length;
  const selected: string[] = [];

  for (let i = 0; i < QUERIES_PER_PAGE; i++) {
    const index = (offset + i) % shuffled.length;
    selected.push(shuffled[index]);
  }

  return selected;
}

function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function isEducationalVideo(item: YouTubeSearchItem): boolean {
  const title = item.snippet?.title ?? '';
  const description = item.snippet?.description ?? '';
  const haystack = `${title} ${description}`.toLowerCase();

  return EDUCATIONAL_KEYWORDS.some((keyword) =>
    haystack.includes(keyword.toLowerCase())
  );
}

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

function dedupeReels(reels: Reel[]): Reel[] {
  const seen = new Set<string>();
  return reels.filter((reel) => {
    if (!reel.id || seen.has(reel.id)) return false;
    seen.add(reel.id);
    return true;
  });
}

function parseExcludedIds(searchParams: URLSearchParams): Set<string> {
  const raw = searchParams.get('exclude');
  if (!raw) return new Set();

  return new Set(
    raw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, MAX_EXCLUDED_IDS)
  );
}

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

// ============================================
// HANDLER
// ============================================

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const customQuery = searchParams.get('q');
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10);
  const page = Math.min(
    Math.max(Number.isFinite(pageParam) ? pageParam : 1, 1),
    MAX_PAGE
  );
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
      : pickQueriesForPage(page);

    const results = await Promise.all(
      queries.map((query) => searchYouTube(query, apiKey))
    );

    const allItems = results.flat();

    const uniqueReels = dedupeReels(
      allItems.filter(isEducationalVideo).map(mapToReel)
    );

    const freshReels = uniqueReels.filter(
      (reel) => !excludedIds.has(reel.id)
    );

    const usedFallback = freshReels.length < RESULTS_PER_PAGE;

    const pool = usedFallback
      ? [...freshReels, ...shuffle(uniqueReels)]
      : freshReels;

    const reels = shuffle(pool).slice(0, RESULTS_PER_PAGE);

    return NextResponse.json(
      {
        reels,
        total: reels.length,
        hasMore: page < MAX_PAGE && reels.length > 0,
        page,
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