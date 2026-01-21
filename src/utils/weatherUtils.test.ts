import { describe, it, expect } from 'vitest';
import { formatTemp, formatDate, getDayName, groupForecastByDay } from '../utils/weatherUtils';
import type { ForecastResponse } from '../types/weather';

describe('weatherUtils', () => {
  describe('formatTemp', () => {
    it('should format temperature with degree symbol', () => {
      expect(formatTemp(20.5)).toBe('21°C');
      expect(formatTemp(0)).toBe('0°C');
      expect(formatTemp(-5.3)).toBe('-5°C');
    });
  });

  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });

    it('treats YYYY-MM-DD as a local date to avoid UTC shifts', () => {
      const expected = new Date(2024, 0, 15).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
      expect(formatDate('2024-01-15')).toBe(expected);
    });
  });

  describe('getDayName', () => {
    it('should return "Today" for today\'s date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(getDayName(today)).toBe('Today');
    });

    it('should return "Tomorrow" for tomorrow\'s date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      expect(getDayName(tomorrowStr)).toBe('Tomorrow');
    });

    it('should return day name for other dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      const dayName = getDayName(futureDateStr);
      expect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).toContain(dayName);
    });
  });

  describe('groupForecastByDay', () => {
    it('should group forecast items by day', () => {
      const mockForecast: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 6,
        list: [
          {
            dt: 1705334400,
            dt_txt: '2024-01-15 12:00:00',
            main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 65 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.5, deg: 180 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
          },
          {
            dt: 1705345200,
            dt_txt: '2024-01-15 15:00:00',
            main: { temp: 22, feels_like: 21, temp_min: 20, temp_max: 24, pressure: 1013, humidity: 60 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 4.0, deg: 180 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
          },
          {
            dt: 1705420800,
            dt_txt: '2024-01-16 12:00:00',
            main: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20, pressure: 1015, humidity: 70 },
            weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
            clouds: { all: 20 },
            wind: { speed: 3.0, deg: 170 },
            visibility: 10000,
            pop: 0.1,
            sys: { pod: 'd' },
          },
        ],
        city: {
          id: 1,
          name: 'Test City',
          coord: { lat: 0, lon: 0 },
          country: 'TC',
          population: 1000,
          timezone: 0,
          sunrise: 1705305600,
          sunset: 1705348800,
        },
      };

      const dailyForecasts = groupForecastByDay(mockForecast);

      expect(dailyForecasts).toHaveLength(2);
      expect(dailyForecasts[0].date).toBe('2024-01-15');
      expect(dailyForecasts[0].hourlyForecasts).toHaveLength(2);
      expect(dailyForecasts[1].date).toBe('2024-01-16');
      expect(dailyForecasts[1].hourlyForecasts).toHaveLength(1);
    });

    it('should calculate correct min/max temperatures', () => {
      const mockForecast: ForecastResponse = {
        cod: '200',
        message: 0,
        cnt: 3,
        list: [
          {
            dt: 1705334400,
            dt_txt: '2024-01-15 12:00:00',
            main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 65 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 3.5, deg: 180 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
          },
          {
            dt: 1705345200,
            dt_txt: '2024-01-15 15:00:00',
            main: { temp: 25, feels_like: 24, temp_min: 23, temp_max: 27, pressure: 1013, humidity: 60 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            clouds: { all: 0 },
            wind: { speed: 4.0, deg: 180 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
          },
          {
            dt: 1705356000,
            dt_txt: '2024-01-15 18:00:00',
            main: { temp: 15, feels_like: 14, temp_min: 13, temp_max: 17, pressure: 1013, humidity: 70 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01n' }],
            clouds: { all: 0 },
            wind: { speed: 2.5, deg: 180 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'n' },
          },
        ],
        city: {
          id: 1,
          name: 'Test City',
          coord: { lat: 0, lon: 0 },
          country: 'TC',
          population: 1000,
          timezone: 0,
          sunrise: 1705305600,
          sunset: 1705348800,
        },
      };

      const dailyForecasts = groupForecastByDay(mockForecast);

      expect(dailyForecasts[0].temp_min).toBe(15);
      expect(dailyForecasts[0].temp_max).toBe(25);
    });
  });
});
