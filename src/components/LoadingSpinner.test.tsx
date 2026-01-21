import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoadingSpinner } from '../components/LoadingSpinner';
import weatherReducer from '../redux/weatherSlice';

describe('LoadingSpinner', () => {
  const createMockStore = () => {
    return configureStore({
      reducer: {
        weather: weatherReducer,
      },
    });
  };

  it('should render loading spinner with message', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LoadingSpinner />
      </Provider>
    );

    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
