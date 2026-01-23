import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

const mocks = vi.hoisted(() => {
  const mockDispatch = vi.fn();
  const selectorState = {
    weather: {
      loading: false,
      error: null as string | null,
    },
  };
  const fetchWeatherByCity = vi.fn((city: string) => ({
    type: 'weather/fetchByCity',
    payload: city,
  }));
  const fetchWeatherByCoordinates = vi.fn((coords: { lat: number; lon: number }) => ({
    type: 'weather/fetchByCoordinates',
    payload: coords,
  }));
  const clearError = vi.fn(() => ({ type: 'weather/clearError' }));

  return {
    mockDispatch,
    selectorState,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    clearError,
  };
});

vi.mock('../redux/hooks', () => ({
  useAppDispatch: () => mocks.mockDispatch,
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
}));

vi.mock('../redux/weatherSlice', () => ({
  fetchWeatherByCity: mocks.fetchWeatherByCity,
  fetchWeatherByCoordinates: mocks.fetchWeatherByCoordinates,
  clearError: mocks.clearError,
}));

vi.mock('react-bootstrap', async () => {
  const actual = await vi.importActual<typeof import('react-bootstrap')>('react-bootstrap');
  const Alert = (({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose?: () => void;
  }) => (
    <div>
      <button type="button" aria-label="Close" onClick={onClose}>
        Close
      </button>
      {children}
    </div>
  )) as unknown as typeof actual.Alert;
  const Toast = (({ children, show }: { children: React.ReactNode; show?: boolean }) =>
    show ? <div>{children}</div> : null) as unknown as typeof actual.Toast;
  Toast.Header = (({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )) as typeof actual.Toast.Header;
  Toast.Body = (({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )) as typeof actual.Toast.Body;

  return {
    ...actual,
    Alert,
    Toast,
    ToastContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

const setGeolocation = (impl?: Geolocation['getCurrentPosition']) => {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: impl ? { getCurrentPosition: impl } : undefined,
  });
};

describe('SearchBar', () => {
  const originalGeolocation = navigator.geolocation;
  const originalSecureContext = window.isSecureContext;

  const setSecureContext = (value: boolean) => {
    Object.defineProperty(window, 'isSecureContext', {
      configurable: true,
      value,
    });
  };

  beforeEach(() => {
    mocks.mockDispatch.mockClear();
    mocks.fetchWeatherByCity.mockClear();
    mocks.fetchWeatherByCoordinates.mockClear();
    mocks.clearError.mockClear();
    mocks.selectorState.weather.loading = false;
    mocks.selectorState.weather.error = null;
    setGeolocation();
    setSecureContext(true);
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: originalGeolocation,
    });
    Object.defineProperty(window, 'isSecureContext', {
      configurable: true,
      value: originalSecureContext,
    });
  });

  it('submits trimmed city name and dispatches fetch', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter city name...');
    fireEvent.change(input, { target: { value: '  Paris  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(mocks.fetchWeatherByCity).toHaveBeenCalledWith('Paris');
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.fetchWeatherByCity.mock.results[0].value);
  });

  it('does not submit when city is empty or whitespace', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter city name...');
    fireEvent.change(input, { target: { value: '   ' } });
    const form = document.querySelector('form');
    if (!form) {
      throw new Error('Expected form element to be present');
    }
    fireEvent.submit(form);

    expect(mocks.fetchWeatherByCity).not.toHaveBeenCalled();
    expect(mocks.mockDispatch).not.toHaveBeenCalled();
  });

  it('disables controls and updates button labels when loading', () => {
    mocks.selectorState.weather.loading = true;
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Enter city name...');
    const searchButton = screen.getByRole('button', { name: 'Searching...' });
    const geoButton = screen.getByRole('button', { name: '📍 My Location' });

    expect(input).toBeDisabled();
    expect(searchButton).toBeDisabled();
    expect(geoButton).toBeDisabled();
  });

  it('shows loading state while geolocation is pending', () => {
    setGeolocation(() => {});
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: '📍 My Location' }));

    expect(screen.getByRole('button', { name: 'Getting location...' })).toBeDisabled();
    expect(screen.getByPlaceholderText('Enter city name...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('dispatches coordinates on geolocation success', async () => {
    setGeolocation((success) => {
      success(
        {
          coords: { latitude: 40.7, longitude: -74.0 },
        } as GeolocationPosition
      );
    });
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: '📍 My Location' }));

    await waitFor(() => {
    expect(mocks.fetchWeatherByCoordinates).toHaveBeenCalledWith({ lat: 40.7, lon: -74.0 });
    });
    expect(mocks.mockDispatch).toHaveBeenCalledWith(
      mocks.fetchWeatherByCoordinates.mock.results[0].value
    );
    expect(screen.getByRole('button', { name: '📍 My Location' })).toBeEnabled();
  });

  it('shows error toast on geolocation failure', async () => {
    setGeolocation((_, error) => {
      error?.({ message: 'Permission denied' } as GeolocationPositionError);
    });
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: '📍 My Location' }));

    expect(await screen.findByText('Error getting location: Permission denied')).toBeInTheDocument();
  });

  it('shows error toast when geolocation is not supported', async () => {
    setGeolocation();
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: '📍 My Location' }));

    expect(await screen.findByText('Geolocation is not supported by your browser')).toBeInTheDocument();
  });

  it('shows error toast when origin is not secure', async () => {
    const geoSpy = vi.fn();
    setGeolocation(geoSpy);
    setSecureContext(false);
    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: '📍 My Location' }));

    expect(
      await screen.findByText('Location access requires a secure origin (HTTPS or localhost)')
    ).toBeInTheDocument();
    expect(geoSpy).not.toHaveBeenCalled();
  });

  it('renders error alert and clears it on dismiss', () => {
    mocks.selectorState.weather.error = 'Failed to fetch weather data';
    render(<SearchBar />);

    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(mocks.clearError).toHaveBeenCalledTimes(1);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.clearError.mock.results[0].value);
  });
});
