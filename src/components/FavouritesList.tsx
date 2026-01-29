import { Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchWeatherByCity } from '../redux/weatherSlice';
import { setShowFavourites } from '../redux/favouritesSlice';

export const FavouritesList = () => {
  const dispatch = useAppDispatch();
  const { items, showList } = useAppSelector((state) => state.favourites);

  if (!showList || items.length === 0) {
    return null;
  }

  const handleSelect = (city: string, country: string) => {
    dispatch(fetchWeatherByCity(`${city}, ${country}`));
    dispatch(setShowFavourites(false));
  };

  return (
    <div className="favourites-list mb-3">
      <div className="text-muted small mb-2">Favourite locations</div>
      <div className="d-flex flex-wrap gap-2">
        {items.map((location) => (
          <Button
            key={`${location.city}-${location.country}`}
            variant="outline-primary"
            size="sm"
            onClick={() => handleSelect(location.city, location.country)}
          >
            {location.city}, {location.country}
          </Button>
        ))}
      </div>
    </div>
  );
};
