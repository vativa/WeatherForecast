import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../redux/hooks';
import { DayCard } from './DayCard';

export const ForecastList = () => {
  const { dailyForecasts, currentLocation } = useAppSelector((state) => state.weather);

  if (dailyForecasts.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {currentLocation && (
        <h3 className="text-center mb-4">
          5-Days Forecast for {currentLocation.city}, {currentLocation.country}
        </h3>
      )}
      <Row xs={1} md={3} lg={5} className="g-3">
        {dailyForecasts.map((forecast) => (
          <Col key={forecast.date}>
            <DayCard forecast={forecast} />
          </Col>
        ))}
      </Row>
      <p className="text-center text-muted mt-3 small">
        Click on a day to see hourly details
      </p>
    </div>
  );
};
