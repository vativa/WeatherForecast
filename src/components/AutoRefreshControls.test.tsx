import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AutoRefreshControls } from './AutoRefreshControls';

const mocks = vi.hoisted(() => {
  const mockDispatch = vi.fn();
  const selectorState = {
    autoRefresh: {
      presetIntervals: [15, 30, 60],
      customIntervals: [45],
      selectedInterval: null as number | null,
    },
    weather: {
      currentLocation: null as { city: string; country: string } | null,
    },
  };

  const selectInterval = vi.fn((value: number | null) => ({
    type: 'autoRefresh/selectInterval',
    payload: value,
  }));
  const addCustomInterval = vi.fn((value: number) => ({
    type: 'autoRefresh/addCustomInterval',
    payload: value,
  }));
  const removeCustomInterval = vi.fn((value: number) => ({
    type: 'autoRefresh/removeCustomInterval',
    payload: value,
  }));

  return {
    mockDispatch,
    selectorState,
    selectInterval,
    addCustomInterval,
    removeCustomInterval,
  };
});

vi.mock('../redux/hooks', () => ({
  useAppDispatch: () => mocks.mockDispatch,
  useAppSelector: (selector: (state: typeof mocks.selectorState) => unknown) =>
    selector(mocks.selectorState),
}));

vi.mock('../redux/autoRefreshSlice', () => ({
  selectInterval: mocks.selectInterval,
  addCustomInterval: mocks.addCustomInterval,
  removeCustomInterval: mocks.removeCustomInterval,
}));

describe('AutoRefreshControls', () => {
  beforeEach(() => {
    mocks.mockDispatch.mockClear();
    mocks.selectInterval.mockClear();
    mocks.addCustomInterval.mockClear();
    mocks.removeCustomInterval.mockClear();
  });

  it('dispatches selectInterval when a preset is clicked', () => {
    render(<AutoRefreshControls />);

    fireEvent.click(screen.getByRole('button', { name: '15 min' }));

    expect(mocks.selectInterval).toHaveBeenCalledWith(15);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.selectInterval.mock.results[0].value);
  });

  it('adds a custom interval from input', () => {
    render(<AutoRefreshControls />);

    fireEvent.change(screen.getByLabelText('Custom interval'), { target: { value: '90' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(mocks.addCustomInterval).toHaveBeenCalledWith(90);
    expect(mocks.selectInterval).toHaveBeenCalledWith(90);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.addCustomInterval.mock.results[0].value);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(mocks.selectInterval.mock.results[0].value);
  });

  it('removes a custom interval', () => {
    render(<AutoRefreshControls />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove 45 minutes' }));

    expect(mocks.removeCustomInterval).toHaveBeenCalledWith(45);
    expect(mocks.mockDispatch).toHaveBeenCalledWith(
      mocks.removeCustomInterval.mock.results[0].value
    );
  });

  it('shows a warning when interval is selected without location', () => {
    mocks.selectorState.autoRefresh.selectedInterval = 15;
    render(<AutoRefreshControls />);

    expect(screen.getByText('Select a location to start auto-refresh.')).toBeInTheDocument();
  });
});
