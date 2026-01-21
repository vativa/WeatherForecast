// OpenWeatherMap API response types

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  '3h'?: number;
}

export interface Snow {
  '3h'?: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: Rain;
  snow?: Snow;
  sys: {
    pod: string; // Part of day (n-night, d-day)
  };
  dt_txt: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: City;
}

export interface DailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: WeatherCondition;
  humidity: number;
  wind_speed: number;
  pop: number;
  hourlyForecasts: ForecastItem[];
}

export interface WeatherState {
  forecast: ForecastResponse | null;
  dailyForecasts: DailyForecast[];
  selectedDay: DailyForecast | null;
  loading: boolean;
  error: string | null;
  currentLocation: { city: string; country: string } | null;
}
