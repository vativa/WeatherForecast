import type { DailyForecast, ForecastItem, ForecastResponse, WeatherCondition } from '../types/weather';

/**
 * Group forecast items by day and create daily summaries
 */
export const groupForecastByDay = (forecast: ForecastResponse): DailyForecast[] => {
  const dailyMap = new Map<string, ForecastItem[]>();

  // Group forecasts by day
  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  // Create daily summaries
  const dailyForecasts: DailyForecast[] = [];
  dailyMap.forEach((items, date) => {
    const temps = items.map((item) => item.main.temp);
    const temp_min = Math.min(...temps);
    const temp_max = Math.max(...temps);

    // Get the most common weather condition for the day
    const weatherCounts = new Map<string, { count: number; weather: WeatherCondition }>();
    items.forEach((item) => {
      const mainWeather = item.weather[0].main;
      if (!weatherCounts.has(mainWeather)) {
        weatherCounts.set(mainWeather, { count: 0, weather: item.weather[0] });
      }
      weatherCounts.get(mainWeather)!.count++;
    });

    let mostCommonWeather = items[0].weather[0];
    let maxCount = 0;
    weatherCounts.forEach((value) => {
      if (value.count > maxCount) {
        maxCount = value.count;
        mostCommonWeather = value.weather;
      }
    });

    // Calculate averages
    const avgHumidity = items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length;
    const avgWindSpeed = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
    const maxPop = Math.max(...items.map((item) => item.pop));

    dailyForecasts.push({
      date,
      temp_min,
      temp_max,
      weather: mostCommonWeather,
      humidity: Math.round(avgHumidity),
      wind_speed: Math.round(avgWindSpeed * 10) / 10,
      pop: Math.round(maxPop * 100),
      hourlyForecasts: items,
    });
  });

  return dailyForecasts.slice(0, 5); // Return only 5 days
};

/**
 * Format temperature with degree symbol
 */
export const formatTemp = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = parseLocalDate(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format time from datetime string
 */
export const formatTime = (dateTimeString: string): string => {
  const date = parseLocalDateTime(dateTimeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const parseLocalDate = (dateString: string): Date => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date(dateString);
};

const parseLocalDateTime = (dateTimeString: string): Date => {
  if (dateTimeString.includes(' ') && !dateTimeString.includes('T')) {
    return new Date(dateTimeString.replace(' ', 'T'));
  }
  return new Date(dateTimeString);
};

/**
 * Get day name from date string
 */
export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
};
