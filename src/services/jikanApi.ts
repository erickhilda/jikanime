import type {
  Anime,
  SearchResponse,
  AnimeVideos,
  AnimePicture,
  AnimeRelation,
} from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export interface SearchParams {
  query: string;
  page?: number;
  filters?: {
    status?: string;
    type?: string;
    rating?: string;
  };
  signal?: AbortSignal;
}

export interface ApiError {
  message: string;
  status?: number;
}

export async function searchAnime({
  query,
  page = 1,
  filters,
  signal,
}: SearchParams): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/anime`);
  url.searchParams.set('q', query);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', '15');

  if (filters) {
    if (filters.status) {
      url.searchParams.set('status', filters.status);
    }
    if (filters.type) {
      url.searchParams.set('type', filters.type);
    }
    if (filters.rating) {
      url.searchParams.set('rating', filters.rating);
    }
  }

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data: SearchResponse = await response.json();
  return data;
}

export async function getAnimeDetails(
  id: number,
  signal?: AbortSignal
): Promise<Anime> {
  const response = await fetch(`${BASE_URL}/anime/${id}`, { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return data.data;
}

export async function getTopAnime(
  page = 1,
  filters?: {
    status?: string;
    type?: string;
    rating?: string;
  },
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/top/anime`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', '15');

  if (filters) {
    if (filters.status) {
      url.searchParams.set('status', filters.status);
    }
    if (filters.type) {
      url.searchParams.set('type', filters.type);
    }
    if (filters.rating) {
      url.searchParams.set('rating', filters.rating);
    }
  }

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data: SearchResponse = await response.json();
  return data;
}

export async function getAnimeVideos(
  id: number,
  signal?: AbortSignal
): Promise<AnimeVideos> {
  const response = await fetch(`${BASE_URL}/anime/${id}/videos`, { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return data.data;
}

export async function getAnimePictures(
  id: number,
  signal?: AbortSignal
): Promise<AnimePicture[]> {
  const response = await fetch(`${BASE_URL}/anime/${id}/pictures`, { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return data.data;
}

export async function getAnimeRelations(
  id: number,
  signal?: AbortSignal
): Promise<AnimeRelation[]> {
  const response = await fetch(`${BASE_URL}/anime/${id}/relations`, { signal });

  if (!response.ok) {
    const error: ApiError = {
      message: `API request failed with status ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return data.data;
}
