import '@testing-library/jest-dom';
import { vi } from 'vitest';

const env = import.meta.env as ImportMetaEnv & { VITE_OPENWEATHER_API_KEY?: string };
if (!env.VITE_OPENWEATHER_API_KEY) {
  Object.defineProperty(import.meta, 'env', {
    value: { ...env, VITE_OPENWEATHER_API_KEY: 'test-api-key' },
    configurable: true,
  });
}

vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-api-key');
