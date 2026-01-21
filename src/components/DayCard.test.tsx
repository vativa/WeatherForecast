import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DayCard } from '../components/DayCard';
import type { DailyForecast } from '../types/weather';
import { formatTemp, getDayName } from '../utils/weatherUtils';

const mocks = vi.hoisted(() => {
  const mockDispatch = vi.fn();
  const setSelectedDay = vi.fn((payload: DailyForecast) => ({
    type: 'weather/setSelectedDay',
    payload,
  }));

  return { mockDispatch, setSelectedDay };
});

vi.mock('../redux/hooks', () => ({
  useAppDispatch: () => mocks.mockDispatch,
}));

vi.mock('../redux/weatherSlice', () => ({
  setSelectedDay: mocks.setSelectedDay,
}));

vi.mock('react-bootstrap', async () => {
  const actual = await vi.importActual<typeof import('react-bootstrap')>('react-bootstrap');
  const Card = actual.Card as typeof actual.Card & {
    Text?: typeof actual.Card.Text;
  };
  if (Card.Text) {
    Card.Text = (({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    )) as typeof actual.Card.Text;
  }
  return {
    ...actual,
    Card,
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

describe('DayCard', () => {
  beforeEach(() => {
    mocks.mockDispatch.mockClear();
    mocks.setSelectedDay.mockClear();
  });

  it('renders forecast data with formatted values', () => {
    const forecast = buildForecast();
    render(<DayCard forecast={forecast} />);

    expect(screen.getByText(getDayName(forecast.date))).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date(forecast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      )
    ).toBeInTheDocument();
    expect(screen.getByText(forecast.weather.main)).toBeInTheDocument();
    expect(
      screen.getByText(`${formatTemp(forecast.temp_max)} / ${formatTemp(forecast.temp_min)}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`💧 ${forecast.humidity}%`)).toBeInTheDocument();
    expect(screen.getByText(`💨 ${forecast.wind_speed} m/s`)).toBeInTheDocument();
    expect(screen.getByText(`☔ ${forecast.pop}%`)).toBeInTheDocument();
    expect(screen.getByAltText(forecast.weather.description)).toBeInTheDocument();
  });

  it('dispatches setSelectedDay with forecast on click', () => {
    const forecast = buildForecast();
    render(<DayCard forecast={forecast} />);

    fireEvent.click(screen.getByText(getDayName(forecast.date)));

    expect(mocks.setSelectedDay).toHaveBeenCalledWith(forecast);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.setSelectedDay.mock.results[0].value);
  });

  it('does not render precipitation when pop is 0', () => {
    const forecast = buildForecast({ pop: 0 });
    render(<DayCard forecast={forecast} />);

    expect(screen.queryByText(/☔/)).not.toBeInTheDocument();
  });
});
