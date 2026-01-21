import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HourlyDetailsModal } from '../components/HourlyDetailsModal';
import { formatDate, formatTemp, formatTime } from '../utils/weatherUtils';
import type { DailyForecast } from '../types/weather';

const mocks = vi.hoisted(() => {
  const mockDispatch = vi.fn();
  const selectorState = {
    weather: {
      selectedDay: null as DailyForecast | null,
    },
  };
  const setSelectedDay = vi.fn((payload: DailyForecast | null) => ({
    type: 'weather/setSelectedDay',
    payload,
  }));

  return { mockDispatch, selectorState, setSelectedDay };
});

vi.mock('../redux/hooks', () => ({
  useAppDispatch: () => mocks.mockDispatch,
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
}));

vi.mock('../redux/weatherSlice', () => ({
  setSelectedDay: mocks.setSelectedDay,
}));

vi.mock('react-bootstrap', async () => {
  const actual = await vi.importActual<typeof import('react-bootstrap')>('react-bootstrap');
  const Modal = (({ show, onHide, children }: { show?: boolean; onHide?: () => void; children: React.ReactNode }) =>
    show ? (
      <div>
        <button aria-label="Close" onClick={onHide}>
          Close
        </button>
        {children}
      </div>
    ) : null) as unknown as typeof actual.Modal;
  Modal.Header = (({ children }: { children: React.ReactNode }) => <div>{children}</div>) as typeof actual.Modal.Header;
  Modal.Title = (({ children }: { children: React.ReactNode }) => <div>{children}</div>) as typeof actual.Modal.Title;
  Modal.Body = (({ children }: { children: React.ReactNode }) => <div>{children}</div>) as typeof actual.Modal.Body;

  return {
    ...actual,
    Modal,
    Table: actual.Table,
  };
});

const buildSelectedDay = (): DailyForecast => ({
  date: '2025-01-01',
  temp_min: 5,
  temp_max: 12,
  weather: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
  humidity: 50,
  wind_speed: 3.4,
  pop: 20,
  hourlyForecasts: [
    {
      dt: 1704105600,
      main: {
        temp: 10.4,
        feels_like: 9.6,
        temp_min: 9,
        temp_max: 11,
        pressure: 1012,
        humidity: 55,
      },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      clouds: { all: 0 },
      wind: { speed: 4.26, deg: 90 },
      visibility: 10000,
      pop: 0.12,
      sys: { pod: 'd' },
      dt_txt: '2025-01-01 09:00:00',
    },
  ],
});

describe('HourlyDetailsModal', () => {
  beforeEach(() => {
    mocks.mockDispatch.mockClear();
    mocks.setSelectedDay.mockClear();
    mocks.selectorState.weather.selectedDay = null;
  });

  it('renders nothing when no selected day', () => {
    const { container } = render(<HourlyDetailsModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows modal title when selected day is set', () => {
    const selectedDay = buildSelectedDay();
    mocks.selectorState.weather.selectedDay = selectedDay;
    render(<HourlyDetailsModal />);

    expect(
      screen.getByText(`Hourly Forecast - ${formatDate(selectedDay.date)}`)
    ).toBeInTheDocument();
  });

  it('renders hourly forecast data with formatted values', () => {
    const selectedDay = buildSelectedDay();
    const forecast = selectedDay.hourlyForecasts[0];
    mocks.selectorState.weather.selectedDay = selectedDay;
    render(<HourlyDetailsModal />);

    expect(screen.getByText(formatTime(forecast.dt_txt))).toBeInTheDocument();
    expect(screen.getAllByText(formatTemp(forecast.main.temp))).toHaveLength(2);
    expect(screen.getByText(`${forecast.main.humidity}%`)).toBeInTheDocument();
    expect(screen.getByText('4.3 m/s')).toBeInTheDocument();
    expect(screen.getByText('12%')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('dispatches setSelectedDay(null) when modal is closed', () => {
    mocks.selectorState.weather.selectedDay = buildSelectedDay();
    render(<HourlyDetailsModal />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(mocks.setSelectedDay).toHaveBeenCalledWith(null);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.setSelectedDay.mock.results[0].value);
  });
});
