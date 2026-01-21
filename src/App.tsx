import { Container } from 'react-bootstrap';
import { SearchBar } from './components/SearchBar';
import { ForecastList } from './components/ForecastList';
import { HourlyDetailsModal } from './components/HourlyDetailsModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAppSelector } from './redux/hooks';
import './App.css';

function App() {
  const { loading, dailyForecasts } = useAppSelector((state) => state.weather);

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <h1 className="display-4">⛅ Weather Forecast</h1>
        <p className="lead text-muted">5-Day Weather Forecast</p>
      </div>

      <SearchBar />

      {loading && <LoadingSpinner />}

      {!loading && dailyForecasts.length === 0 && (
        <div className="text-center text-muted my-5">
          <h4>Welcome!</h4>
          <p>Search for a city or use your location to get started</p>
        </div>
      )}

      {!loading && <ForecastList />}

      <HourlyDetailsModal />
    </Container>
  );
}

export default App;

