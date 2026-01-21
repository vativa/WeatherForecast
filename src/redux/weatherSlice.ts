import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WeatherState, ForecastResponse, DailyForecast } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { groupForecastByDay } from '../utils/weatherUtils';

const initialState: WeatherState = {
  forecast: null,
  dailyForecasts: [],
  selectedDay: null,
  loading: false,
  error: null,
  currentLocation: null,
};

// Async thunks
export const fetchWeatherByCity = createAsyncThunk(
  'weather/fetchByCity',
  async (city: string) => {
    const forecast = await weatherService.getForecastByCity(city);
    return forecast;
  }
);

export const fetchWeatherByCoordinates = createAsyncThunk(
  'weather/fetchByCoordinates',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const forecast = await weatherService.getForecastByCoordinates(lat, lon);
    return forecast;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<DailyForecast | null>) => {
      state.selectedDay = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch by city
    builder.addCase(fetchWeatherByCity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWeatherByCity.fulfilled, (state, action: PayloadAction<ForecastResponse>) => {
      state.loading = false;
      state.forecast = action.payload;
      state.dailyForecasts = groupForecastByDay(action.payload);
      state.currentLocation = {
        city: action.payload.city.name,
        country: action.payload.city.country,
      };
      state.selectedDay = null;
    });
    builder.addCase(fetchWeatherByCity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch weather data';
    });

    // Fetch by coordinates
    builder.addCase(fetchWeatherByCoordinates.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWeatherByCoordinates.fulfilled, (state, action: PayloadAction<ForecastResponse>) => {
      state.loading = false;
      state.forecast = action.payload;
      state.dailyForecasts = groupForecastByDay(action.payload);
      state.currentLocation = {
        city: action.payload.city.name,
        country: action.payload.city.country,
      };
      state.selectedDay = null;
    });
    builder.addCase(fetchWeatherByCoordinates.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch weather data';
    });
  },
});

export const { setSelectedDay, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
