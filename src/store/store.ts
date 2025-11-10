import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './slices/animeSlice';
import animeDetailsReducer from './slices/animeDetailsSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
    animeDetails: animeDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

