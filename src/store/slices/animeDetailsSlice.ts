import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAnimeDetails } from '../../services/jikanApi';
import type { Anime } from '../../types/anime';

interface AnimeDetailsState {
  anime: Anime | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnimeDetailsState = {
  anime: null,
  loading: false,
  error: null,
};

let detailsAbortController: AbortController | null = null;

export const fetchAnimeDetailsAsync = createAsyncThunk(
  'animeDetails/fetch',
  async (id: number, { rejectWithValue }) => {
    // Cancel previous request if any
    if (detailsAbortController) {
      detailsAbortController.abort();
    }

    // Create new abort controller for this request
    detailsAbortController = new AbortController();

    try {
      const anime = await getAnimeDetails(id, detailsAbortController.signal);
      return anime;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch anime details';
      return rejectWithValue(apiError);
    }
  }
);

const animeDetailsSlice = createSlice({
  name: 'animeDetails',
  initialState,
  reducers: {
    clearDetails: (state) => {
      state.anime = null;
      state.error = null;
    },
    cancelDetailsFetch: () => {
      if (detailsAbortController) {
        detailsAbortController.abort();
        detailsAbortController = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.anime = action.payload;
      })
      .addCase(fetchAnimeDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'Request was cancelled') {
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to fetch anime details';
        }
      });
  },
});

export const { clearDetails, cancelDetailsFetch } = animeDetailsSlice.actions;
export default animeDetailsSlice.reducer;

