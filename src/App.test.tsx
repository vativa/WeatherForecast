import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DailyForecast } from './types/weather';
import App from './App';

const mocks = vi.hoisted(() => {
  const mockDispatch = vi.fn();
  const selectorState = {
    weather: {
      loading: false,
      dailyForecasts: [] as DailyForecast[],
      currentLocation: null as { city: string; country: string } | null,
    },
    autoRefresh: {
      selectedInterval: null as number | null,
    },
  };

  const fetchWeatherByCity = vi.fn((city: string) => ({
    type: 'weather/fetchByCity',
    payload: city,
  }));

  return { selectorState, mockDispatch, fetchWeatherByCity };
});

vi.mock('./redux/hooks', () => ({
  useAppDispatch: () => mocks.mockDispatch,
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
}));

vi.mock('./redux/weatherSlice', () => ({
  fetchWeatherByCity: mocks.fetchWeatherByCity,
}));

vi.mock('./components/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}));

vi.mock('./components/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">LoadingSpinner</div>,
}));

vi.mock('./components/HourlyDetailsModal', () => ({
  HourlyDetailsModal: () => <div data-testid="hourly-details-modal">HourlyDetailsModal</div>,
}));

vi.mock('./components/TopNavBar', () => ({
  TopNavBar: () => <div data-testid="top-nav-bar">TopNavBar</div>,
}));

vi.mock('./components/ForecastList', () => ({
  ForecastList: () =>
    mocks.selectorState.weather.dailyForecasts.length === 0 ? null : (
      <div data-testid="forecast-list">ForecastList</div>
    ),
}));

const buildForecast = (overrides?: Partial<DailyForecast>): DailyForecast => ({
  date: '2025-01-02',
  temp_min: 6,
  temp_max: 12,
  weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  humidity: 55,
  wind_speed: 3.4,
  pop: 30,
  hourlyForecasts: [],
  ...overrides,
});

describe('App', () => {
  beforeEach(() => {
    mocks.selectorState.weather.loading = false;
    mocks.selectorState.weather.dailyForecasts = [];
    mocks.selectorState.weather.currentLocation = null;
    mocks.selectorState.autoRefresh.selectedInterval = null;
    mocks.mockDispatch.mockClear();
    mocks.fetchWeatherByCity.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders header and search message when idle with no forecasts', () => {
    render(<App />);

    expect(screen.getByText('⛅ Weather Forecast')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByText(/Search for a city/)).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forecast-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('hourly-details-modal')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    mocks.selectorState.weather.loading = true;
    render(<App />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText(/Search for a city/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('forecast-list')).not.toBeInTheDocument();
  });

  it('renders forecast list when data is available', () => {
    mocks.selectorState.weather.dailyForecasts = [buildForecast()];
    render(<App />);

    expect(screen.getByTestId('forecast-list')).toBeInTheDocument();
    expect(screen.queryByText(/Search for a city/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('auto-refreshes when an interval and location are selected', () => {
    vi.useFakeTimers();
    mocks.selectorState.weather.currentLocation = { city: 'Paris', country: 'FR' };
    mocks.selectorState.autoRefresh.selectedInterval = 15;

    render(<App />);
    expect(mocks.fetchWeatherByCity).toHaveBeenCalledWith('Paris, FR');
    vi.advanceTimersByTime(15 * 60 * 1000);

    expect(mocks.fetchWeatherByCity).toHaveBeenCalledWith('Paris, FR');
    expect(mocks.mockDispatch).toHaveBeenCalledWith(
      mocks.fetchWeatherByCity.mock.results[0].value
    );
    expect(mocks.fetchWeatherByCity).toHaveBeenCalledTimes(2);
  });
});
