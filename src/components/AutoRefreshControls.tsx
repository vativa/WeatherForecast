import { useState } from 'react';
import { Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addCustomInterval,
  removeCustomInterval,
  selectInterval,
} from '../redux/autoRefreshSlice';

export const AutoRefreshControls = () => {
  const dispatch = useAppDispatch();
  const { presetIntervals, customIntervals, selectedInterval } = useAppSelector(
    (state) => state.autoRefresh
  );
  const currentLocation = useAppSelector((state) => state.weather.currentLocation);
  const [customValue, setCustomValue] = useState('');
  const parsedCustomValue = Number.parseInt(customValue, 10);
  const canAdd = Number.isFinite(parsedCustomValue) && parsedCustomValue > 0;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canAdd) {
      return;
    }
    dispatch(addCustomInterval(parsedCustomValue));
    dispatch(selectInterval(parsedCustomValue));
    setCustomValue('');
  };

  return (
    <div className="auto-refresh mb-3">
      <div className="text-muted small mb-2">Auto-refresh</div>
      {selectedInterval && !currentLocation && (
        <Alert variant="warning" className="py-2 mb-3">
          Select a location to start auto-refresh.
        </Alert>
      )}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button
          variant={selectedInterval === null ? 'secondary' : 'outline-secondary'}
          size="sm"
          onClick={() => dispatch(selectInterval(null))}
        >
          Off
        </Button>
        {presetIntervals.map((value) => (
          <Button
            key={value}
            variant={selectedInterval === value ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => dispatch(selectInterval(value))}
          >
            {value} min
          </Button>
        ))}
      </div>
      <Form onSubmit={handleAdd}>
        <InputGroup className="mb-2">
          <Form.Control
            type="number"
            min={1}
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            placeholder="Add custom minutes"
            aria-label="Custom interval"
          />
          <Button
            type="submit"
            variant="outline-primary"
            disabled={!canAdd}
          >
            Add
          </Button>
        </InputGroup>
      </Form>
      {customIntervals.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {customIntervals.map((value) => (
            <div key={value} className="d-flex align-items-center gap-1">
              <Button
                variant={selectedInterval === value ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => dispatch(selectInterval(value))}
              >
                {value} min
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                aria-label={`Remove ${value} minutes`}
                onClick={() => dispatch(removeCustomInterval(value))}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
