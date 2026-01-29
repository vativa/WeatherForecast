import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import favouritesReducer from './favouritesSlice';
import autoRefreshReducer from './autoRefreshSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favourites: favouritesReducer,
    autoRefresh: autoRefreshReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
