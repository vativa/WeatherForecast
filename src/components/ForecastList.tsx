import { Row, Col, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { DayCard } from './DayCard';
import { toggleFavourite } from '../redux/favouritesSlice';

const isFavourite = (
  city: string,
  country: string,
  items: { city: string; country: string }[]
) =>
  items.some(
    (item) =>
      item.city.toLowerCase() === city.toLowerCase() &&
      item.country.toLowerCase() === country.toLowerCase()
  );

export const ForecastList = () => {
  const dispatch = useAppDispatch();
  const { dailyForecasts, currentLocation } = useAppSelector((state) => state.weather);
  const favourites = useAppSelector((state) => state.favourites.items);

  if (dailyForecasts.length === 0) {
    return null;
  }

  const favouriteActive =
    currentLocation &&
    isFavourite(currentLocation.city, currentLocation.country, favourites);

  return (
    <div className="mb-4">
      {currentLocation && (
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4">
          <h3 className="text-center m-0">
            5-Day Forecast for {currentLocation.city}, {currentLocation.country}
          </h3>
          <Button
            variant={favouriteActive ? 'danger' : 'outline-danger'}
            size="sm"
            onClick={() => dispatch(toggleFavourite(currentLocation))}
          >
            {favouriteActive ? '❤ Saved' : '❤ Save'}
          </Button>
        </div>
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
