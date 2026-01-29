import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FavouriteLocation, FavouritesState } from '../types/favourites';

const STORAGE_KEY = 'weather:favourites';

const getLocationKey = (location: FavouriteLocation) =>
  `${location.city.toLowerCase()}|${location.country.toLowerCase()}`;

const loadFavourites = (): FavouriteLocation[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is FavouriteLocation =>
        typeof item?.city === 'string' && typeof item?.country === 'string'
    );
  } catch {
    return [];
  }
};

const saveFavourites = (items: FavouriteLocation[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore persistence errors (storage full, blocked, etc.)
  }
};

const initialState: FavouritesState = {
  items: loadFavourites(),
  showList: false,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<FavouriteLocation>) => {
      const key = getLocationKey(action.payload);
      const existingIndex = state.items.findIndex(
        (item) => getLocationKey(item) === key
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.unshift(action.payload);
      }

      saveFavourites(state.items);
    },
    setShowFavourites: (state, action: PayloadAction<boolean>) => {
      state.showList = action.payload;
    },
    toggleShowFavourites: (state) => {
      state.showList = !state.showList;
    },
    clearFavourites: (state) => {
      state.items = [];
      saveFavourites(state.items);
    },
  },
});

export const {
  toggleFavourite,
  setShowFavourites,
  toggleShowFavourites,
  clearFavourites,
} = favouritesSlice.actions;
export default favouritesSlice.reducer;
