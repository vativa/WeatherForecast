import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { DailyForecast } from '../types/weather';
import { ForecastList } from './ForecastList';

const mocks = vi.hoisted(() => {
  const selectorState = {
    weather: {
      dailyForecasts: [] as DailyForecast[],
      currentLocation: null as { city: string; country: string } | null,
    },
  };

  return { selectorState };
});

vi.mock('../redux/hooks', () => ({
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
}));

vi.mock('./DayCard', () => ({
  DayCard: ({ forecast }: { forecast: DailyForecast }) => (
    <div data-testid="day-card">{forecast.date}</div>
  ),
}));

vi.mock('react-bootstrap', async () => {
  const actual = await vi.importActual<typeof import('react-bootstrap')>('react-bootstrap');
  return {
    ...actual,
    Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Col: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

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

describe('ForecastList', () => {
  beforeEach(() => {
    mocks.selectorState.weather.dailyForecasts = [];
    mocks.selectorState.weather.currentLocation = null;
  });

  it('renders nothing when there are no forecasts', () => {
    const { container } = render(<ForecastList />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders heading, cards, and helper text when forecasts exist', () => {
    mocks.selectorState.weather.dailyForecasts = [
      buildForecast({ date: '2025-01-02' }),
      buildForecast({ date: '2025-01-03' }),
    ];
    mocks.selectorState.weather.currentLocation = { city: 'Paris', country: 'FR' };

    render(<ForecastList />);

    expect(
      screen.getByText('5-Day Forecast for Paris, FR')
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('day-card')).toHaveLength(2);
    expect(screen.getByText('Click on a day to see hourly details')).toBeInTheDocument();
  });

  it('omits heading when location is not available', () => {
    mocks.selectorState.weather.dailyForecasts = [buildForecast()];

    render(<ForecastList />);

    expect(screen.queryByText(/5-Day Forecast for/i)).not.toBeInTheDocument();
  });
});
