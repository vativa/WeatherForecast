import type { ForecastResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  /**
   * Get 5-day weather forecast by city name
   */
  getForecastByCity: async (city: string): Promise<ForecastResponse> => {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }

    return response.json();
  },

  /**
   * Get 5-day weather forecast by coordinates
   */
  getForecastByCoordinates: async (lat: number, lon: number): Promise<ForecastResponse> => {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }

    return response.json();
  },

  /**
   * Get icon URL for weather condition
   */
  getWeatherIconUrl: (icon: string): string => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  },
};
