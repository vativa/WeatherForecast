import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DailyForecast } from './types/weather';
import App from './App';

const mocks = vi.hoisted(() => {
  const selectorState = {
    weather: {
      loading: false,
      dailyForecasts: [] as DailyForecast[],
      currentLocation: null as { city: string; country: string } | null,
    },
  };

  return { selectorState };
});

vi.mock('./redux/hooks', () => ({
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
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
  });

  it('renders header and search message when idle with no forecasts', () => {
    render(<App />);

    expect(screen.getByText('⛅ Weather Forecast')).toBeInTheDocument();
    expect(screen.getByText('5-Day Weather Forecast')).toBeInTheDocument();
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
});
