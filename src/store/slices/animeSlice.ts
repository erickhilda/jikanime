import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { searchAnime, getTopAnime } from '../../services/jikanApi';
import type { Anime } from '../../types/anime';

interface AnimeState {
  results: Anime[];
  currentPage: number;
  totalPages: number;
  query: string;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const initialState: AnimeState = {
  results: [],
  currentPage: 1,
  totalPages: 1,
  query: '',
  loading: false,
  error: null,
  hasSearched: false,
};

let abortController: AbortController | null = null;

export const searchAnimeAsync = createAsyncThunk(
  'anime/search',
  async (
    { query, page = 1 }: { query: string; page?: number },
    { rejectWithValue }
  ) => {
    // Cancel previous request if any
    if (abortController) {
      abortController.abort();
    }

    // Create new abort controller for this request
    abortController = new AbortController();

    try {
      const response = await searchAnime({
        query,
        page,
        signal: abortController.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to search anime';
      return rejectWithValue(apiError);
    }
  }
);

export const fetchTopAnimeAsync = createAsyncThunk(
  'anime/fetchTop',
  async (page: number = 1, { rejectWithValue }) => {
    // Cancel previous request if any
    if (abortController) {
      abortController.abort();
    }

    // Create new abort controller for this request
    abortController = new AbortController();

    try {
      const response = await getTopAnime(page, abortController.signal);
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch top anime';
      return rejectWithValue(apiError);
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.query = '';
      state.error = null;
      state.hasSearched = false;
    },
    cancelSearch: () => {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAnimeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAnimeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.currentPage = action.payload.pagination.current_page;
        state.totalPages = action.payload.pagination.last_visible_page;
        state.hasSearched = true;
      })
      .addCase(searchAnimeAsync.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'Request was cancelled') {
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to search anime';
        }
      })
      .addCase(fetchTopAnimeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopAnimeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.data;
        state.currentPage = action.payload.pagination.current_page;
        state.totalPages = action.payload.pagination.last_visible_page;
        state.hasSearched = false; // Keep as false since this is default content, not a search
      })
      .addCase(fetchTopAnimeAsync.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'Request was cancelled') {
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to fetch top anime';
        }
      });
  },
});

export const { setPage, setQuery, clearResults, cancelSearch } =
  animeSlice.actions;
export default animeSlice.reducer;

