import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AutoRefreshState } from '../types/autoRefresh';

const PRESET_INTERVALS = [15, 30, 60];

const initialState: AutoRefreshState = {
  presetIntervals: PRESET_INTERVALS,
  customIntervals: [],
  selectedInterval: null,
};

const autoRefreshSlice = createSlice({
  name: 'autoRefresh',
  initialState,
  reducers: {
    selectInterval: (state, action: PayloadAction<number | null>) => {
      state.selectedInterval = action.payload;
    },
    addCustomInterval: (state, action: PayloadAction<number>) => {
      const value = action.payload;
      if (state.customIntervals.includes(value) || state.presetIntervals.includes(value)) {
        return;
      }
      state.customIntervals = [...state.customIntervals, value].sort((a, b) => a - b);
    },
    removeCustomInterval: (state, action: PayloadAction<number>) => {
      state.customIntervals = state.customIntervals.filter((value) => value !== action.payload);
      if (state.selectedInterval === action.payload) {
        state.selectedInterval = null;
      }
    },
  },
});

export const { selectInterval, addCustomInterval, removeCustomInterval } = autoRefreshSlice.actions;
export default autoRefreshSlice.reducer;
