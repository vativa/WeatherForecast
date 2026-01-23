import { Card } from 'react-bootstrap';
import type { DailyForecast } from '../types/weather';
import { formatTemp, getDayName } from '../utils/weatherUtils';
import { weatherService } from '../services/weatherService';
import { useAppDispatch } from '../redux/hooks';
import { setSelectedDay } from '../redux/weatherSlice';

interface DayCardProps {
  forecast: DailyForecast;
}

export const DayCard = ({ forecast }: DayCardProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setSelectedDay(forecast));
  };

  return (
    <Card 
      className="text-center h-100 day-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <Card.Title as="h6">{getDayName(forecast.date)}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {new Date(forecast.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Card.Subtitle>
        <img
          src={weatherService.getWeatherIconUrl(forecast.weather.icon)}
          alt={forecast.weather.description}
          style={{ width: '80px', height: '80px' }}
        />
        <Card.Text className="mb-1">
          <strong>{forecast.weather.main}</strong>
        </Card.Text>
        <Card.Text className="mb-1">
          {formatTemp(forecast.temp_max)} / {formatTemp(forecast.temp_min)}
        </Card.Text>
        <Card.Text className="text-muted small">
          <div>💧 {forecast.humidity}%</div>
          <div>💨 {forecast.wind_speed} m/s</div>
          {forecast.pop > 0 && <div>☔ {forecast.pop}%</div>}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
