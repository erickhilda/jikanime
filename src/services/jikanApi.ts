import type { Anime, SearchResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

export interface SearchParams {
  query: string;
  page?: number;
  signal?: AbortSignal;
}

export interface ApiError {
  message: string;
  status?: number;
}

export async function searchAnime({
  query,
  page = 1,
  signal,
}: SearchParams): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/anime`);
  url.searchParams.set('q', query);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', '20');

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
  signal?: AbortSignal
): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/top/anime`);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('limit', '20');

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

