import { useState } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeatherByCity, fetchWeatherByCoordinates, clearError } from '../redux/weatherSlice';

export const SearchBar = () => {
  const [city, setCity] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.weather);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeatherByCity(city.trim()));
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchWeatherByCoordinates({ lat: latitude, lon: longitude }));
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        alert(`Error getting location: ${error.message}`);
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
