import { Modal, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSelectedDay } from '../redux/weatherSlice';
import { formatTemp, formatTime, formatDate } from '../utils/weatherUtils';
import { weatherService } from '../services/weatherService';

export const HourlyDetailsModal = () => {
  const dispatch = useAppDispatch();
  const { selectedDay } = useAppSelector((state) => state.weather);

  const handleClose = () => {
    dispatch(setSelectedDay(null));
  };

  if (!selectedDay) {
    return null;
  }

  return (
    <Modal show={!!selectedDay} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Hourly Forecast - {formatDate(selectedDay.date)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Time</th>
                <th>Weather</th>
                <th>Temp</th>
                <th>Feels Like</th>
                <th>Humidity</th>
                <th>Wind</th>
                <th>Rain Prob.</th>
              </tr>
            </thead>
            <tbody>
              {selectedDay.hourlyForecasts.map((forecast) => (
                <tr key={forecast.dt}>
                  <td>{formatTime(forecast.dt_txt)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={weatherService.getWeatherIconUrl(forecast.weather[0].icon)}
                        alt={forecast.weather[0].description}
                        style={{ width: '40px', height: '40px' }}
                      />
                      <span className="ms-2">{forecast.weather[0].description}</span>
                    </div>
                  </td>
                  <td>{formatTemp(forecast.main.temp)}</td>
                  <td>{formatTemp(forecast.main.feels_like)}</td>
                  <td>{forecast.main.humidity}%</td>
                  <td>{Math.round(forecast.wind.speed * 10) / 10} m/s</td>
                  <td>{Math.round(forecast.pop * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};
