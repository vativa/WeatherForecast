import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = () => {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">Loading weather data...</p>
    </div>
  );
};
