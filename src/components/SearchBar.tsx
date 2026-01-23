import { useState } from 'react';
import { Form, Button, InputGroup, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeatherByCity, fetchWeatherByCoordinates, clearError } from '../redux/weatherSlice';

export const SearchBar = () => {
  const [city, setCity] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.weather);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeatherByCity(city.trim()));
    }
  };

  const handleGeolocation = () => {
    if (!window.isSecureContext) {
      setGeoError('Location access requires a secure origin (HTTPS or localhost)');
      return;
    }
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchWeatherByCoordinates({ lat: latitude, lon: longitude }));
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        setGeoError(`Error getting location: ${error.message}`);
      }
    );
  };

  return (
    <div className="mb-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={!!geoError} onClose={() => setGeoError(null)} delay={5000} autohide bg="danger">
          <Toast.Header>
            <strong className="me-auto">Location Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{geoError}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Form onSubmit={handleSearch}>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading || geoLoading}
          />
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !city.trim() || geoLoading}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleGeolocation}
            disabled={loading || geoLoading}
            title="Use my location"
          >
            {geoLoading ? 'Getting location...' : '📍 My Location'}
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};
