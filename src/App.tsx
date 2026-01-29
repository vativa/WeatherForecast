import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { SearchBar } from './components/SearchBar';
import { ForecastList } from './components/ForecastList';
import { HourlyDetailsModal } from './components/HourlyDetailsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TopNavBar } from './components/TopNavBar';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchWeatherByCity } from './redux/weatherSlice';
import { selectInterval } from './redux/autoRefreshSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { loading, dailyForecasts, currentLocation } = useAppSelector((state) => state.weather);
  const { selectedInterval } = useAppSelector((state) => state.autoRefresh);

  useEffect(() => {
    if (!selectedInterval || !currentLocation) {
      return;
    }

    dispatch(
      fetchWeatherByCity(`${currentLocation.city}, ${currentLocation.country}`)
    );

    const intervalId = window.setInterval(() => {
      dispatch(
        fetchWeatherByCity(`${currentLocation.city}, ${currentLocation.country}`)
      );
    }, selectedInterval * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [
    dispatch,
    selectedInterval,
    currentLocation?.city,
    currentLocation?.country,
  ]);

  useEffect(() => {
    if (selectedInterval && !currentLocation) {
      dispatch(selectInterval(null));
    }
  }, [dispatch, selectedInterval, currentLocation]);

  return (
    <>
      <TopNavBar />
      <Container className="py-4">
        <div className="text-center mb-4">
          <h1 className="display-4">⛅ Weather Forecast</h1>
        </div>
        <SearchBar />
        {!loading && dailyForecasts.length === 0 && (
          <p className="text-center">Search for a city or use your location to get started</p>
        )}
        {loading && <LoadingSpinner />}
        {!loading && <ForecastList />}
        <HourlyDetailsModal />
      </Container>
    </>
  );
}

export default App;
