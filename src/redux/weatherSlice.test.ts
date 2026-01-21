import { describe, it, expect } from 'vitest';
import weatherReducer, { setSelectedDay, clearError } from '../redux/weatherSlice';
import type { WeatherState, DailyForecast } from '../types/weather';

describe('weatherSlice', () => {
  const initialState: WeatherState = {
    forecast: null,
    dailyForecasts: [],
    selectedDay: null,
    loading: false,
    error: null,
    currentLocation: null,
  };

  it('should return initial state', () => {
    expect(weatherReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSelectedDay', () => {
    const mockDay: DailyForecast = {
      date: '2024-01-15',
      temp_min: 10,
      temp_max: 20,
      weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
      humidity: 65,
      wind_speed: 3.5,
      pop: 0,
      hourlyForecasts: [],
    };

    const newState = weatherReducer(initialState, setSelectedDay(mockDay));
    expect(newState.selectedDay).toEqual(mockDay);
  });

  it('should handle setSelectedDay with null', () => {
    const stateWithSelectedDay: WeatherState = {
      ...initialState,
      selectedDay: {
        date: '2024-01-15',
        temp_min: 10,
        temp_max: 20,
        weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
        humidity: 65,
        wind_speed: 3.5,
        pop: 0,
        hourlyForecasts: [],
      },
    };

    const newState = weatherReducer(stateWithSelectedDay, setSelectedDay(null));
    expect(newState.selectedDay).toBeNull();
  });

  it('should handle clearError', () => {
    const stateWithError: WeatherState = {
      ...initialState,
      error: 'Some error occurred',
    };

    const newState = weatherReducer(stateWithError, clearError());
    expect(newState.error).toBeNull();
  });
});
