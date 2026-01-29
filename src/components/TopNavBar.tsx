import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleShowFavourites, clearFavourites } from '../redux/favouritesSlice';

export const TopNavBar = () => {
  const dispatch = useAppDispatch();
  const { items, showList } = useAppSelector((state) => state.favourites);

  const handleToggle = () => {
    dispatch(toggleShowFavourites());
  };

  return (
    <Navbar bg="light" sticky="top" className="shadow-sm">
      <Container className="justify-content-between">
        <Navbar.Brand className="fw-semibold">Weather Forecast</Navbar.Brand>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant={showList ? 'danger' : 'outline-danger'}
            onClick={handleToggle}
            aria-pressed={showList}
          >
            ❤ Favourites
            {items.length > 0 && (
              <Badge bg="danger" className="ms-2">
                {items.length}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => dispatch(clearFavourites())}
            disabled={items.length === 0}
            aria-label="Clear favourites"
          >
            ✕
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};
