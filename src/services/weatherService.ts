import type { ForecastResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.warn('VITE_OPENWEATHER_API_KEY is not set. Please add it to your .env file.');
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  /**
   * Get 5-day weather forecast by city name
   */
  getForecastByCity: async (city: string): Promise<ForecastResponse> => {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in your .env file.');
    }

    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return response.json();
  },

  /**
   * Get 5-day weather forecast by coordinates
   */
  getForecastByCoordinates: async (lat: number, lon: number): Promise<ForecastResponse> => {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is not configured. Please set VITE_OPENWEATHER_API_KEY in your .env file.');
    }

    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
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

export const getErrorMessage = async (response: Response): Promise<string> => {
  const fallback = 'Failed to fetch weather data';
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return fallback;
  }
  try {
    const errorData = (await response.json()) as { message?: string };
    return errorData.message || fallback;
  } catch {
    return fallback;
  }
};
