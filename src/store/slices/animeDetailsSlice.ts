import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAnimeDetails,
  getAnimeVideos,
  getAnimePictures,
  getAnimeRelations,
} from '../../services/jikanApi';
import type {
  Anime,
  AnimeVideos,
  AnimePicture,
  AnimeRelation,
} from '../../types/anime';

interface AnimeDetailsState {
  anime: Anime | null;
  loading: boolean;
  error: string | null;
  videos: AnimeVideos | null;
  videosLoading: boolean;
  videosError: string | null;
  pictures: AnimePicture[] | null;
  picturesLoading: boolean;
  picturesError: string | null;
  relations: AnimeRelation[] | null;
  relationsLoading: boolean;
  relationsError: string | null;
}

const initialState: AnimeDetailsState = {
  anime: null,
  loading: false,
  error: null,
  videos: null,
  videosLoading: false,
  videosError: null,
  pictures: null,
  picturesLoading: false,
  picturesError: null,
  relations: null,
  relationsLoading: false,
  relationsError: null,
};

let detailsAbortController: AbortController | null = null;
let videosAbortController: AbortController | null = null;
let picturesAbortController: AbortController | null = null;
let relationsAbortController: AbortController | null = null;

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

export const fetchAnimeVideosAsync = createAsyncThunk(
  'animeDetails/fetchVideos',
  async (id: number, { rejectWithValue }) => {
    if (videosAbortController) {
      videosAbortController.abort();
    }

    videosAbortController = new AbortController();

    try {
      const videos = await getAnimeVideos(id, videosAbortController.signal);
      return videos;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch anime videos';
      return rejectWithValue(apiError);
    }
  }
);

export const fetchAnimePicturesAsync = createAsyncThunk(
  'animeDetails/fetchPictures',
  async (id: number, { rejectWithValue }) => {
    if (picturesAbortController) {
      picturesAbortController.abort();
    }

    picturesAbortController = new AbortController();

    try {
      const pictures = await getAnimePictures(
        id,
        picturesAbortController.signal
      );
      return pictures;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch anime pictures';
      return rejectWithValue(apiError);
    }
  }
);

export const fetchAnimeRelationsAsync = createAsyncThunk(
  'animeDetails/fetchRelations',
  async (id: number, { rejectWithValue }) => {
    if (relationsAbortController) {
      relationsAbortController.abort();
    }

    relationsAbortController = new AbortController();

    try {
      const relations = await getAnimeRelations(
        id,
        relationsAbortController.signal
      );
      return relations;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled');
      }
      const apiError =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to fetch anime relations';
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
      state.videos = null;
      state.videosError = null;
      state.pictures = null;
      state.picturesError = null;
      state.relations = null;
      state.relationsError = null;
    },
    cancelDetailsFetch: () => {
      if (detailsAbortController) {
        detailsAbortController.abort();
        detailsAbortController = null;
      }
      if (videosAbortController) {
        videosAbortController.abort();
        videosAbortController = null;
      }
      if (picturesAbortController) {
        picturesAbortController.abort();
        picturesAbortController = null;
      }
      if (relationsAbortController) {
        relationsAbortController.abort();
        relationsAbortController = null;
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
      })
      .addCase(fetchAnimeVideosAsync.pending, (state) => {
        state.videosLoading = true;
        state.videosError = null;
      })
      .addCase(fetchAnimeVideosAsync.fulfilled, (state, action) => {
        state.videosLoading = false;
        state.videos = action.payload;
      })
      .addCase(fetchAnimeVideosAsync.rejected, (state, action) => {
        state.videosLoading = false;
        if (action.payload !== 'Request was cancelled') {
          state.videosError =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to fetch anime videos';
        }
      })
      .addCase(fetchAnimePicturesAsync.pending, (state) => {
        state.picturesLoading = true;
        state.picturesError = null;
      })
      .addCase(fetchAnimePicturesAsync.fulfilled, (state, action) => {
        state.picturesLoading = false;
        state.pictures = action.payload;
      })
      .addCase(fetchAnimePicturesAsync.rejected, (state, action) => {
        state.picturesLoading = false;
        if (action.payload !== 'Request was cancelled') {
          state.picturesError =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to fetch anime pictures';
        }
      })
      .addCase(fetchAnimeRelationsAsync.pending, (state) => {
        state.relationsLoading = true;
        state.relationsError = null;
      })
      .addCase(fetchAnimeRelationsAsync.fulfilled, (state, action) => {
        state.relationsLoading = false;
        state.relations = action.payload;
      })
      .addCase(fetchAnimeRelationsAsync.rejected, (state, action) => {
        state.relationsLoading = false;
        if (action.payload !== 'Request was cancelled') {
          state.relationsError =
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to fetch anime relations';
        }
      });
  },
});

export const { clearDetails, cancelDetailsFetch } = animeDetailsSlice.actions;
export default animeDetailsSlice.reducer;

