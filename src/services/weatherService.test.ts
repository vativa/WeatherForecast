import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../services/weatherService';

describe('getErrorMessage', () => {
  it('returns fallback for non-json content-type', async () => {
    const response = new Response('<html>Server error</html>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });

    await expect(getErrorMessage(response)).resolves.toBe('Failed to fetch weather data');
  });

  it('returns message from json response when available', async () => {
    const response = new Response(JSON.stringify({ message: 'Bad request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });

    await expect(getErrorMessage(response)).resolves.toBe('Bad request');
  });

  it('returns fallback for json response without message', async () => {
    const response = new Response(JSON.stringify({}), {
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    await expect(getErrorMessage(response)).resolves.toBe('Failed to fetch weather data');
  });

  it('returns fallback when json parsing fails', async () => {
    const response = new Response('not json', {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });

    await expect(getErrorMessage(response)).resolves.toBe('Failed to fetch weather data');
  });
});
