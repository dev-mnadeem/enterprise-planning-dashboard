import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { server } from './test/server';
import { store } from './state/store';
import { logoutUser } from './state/reducers';

// simplebar measures the DOM with ResizeObserver, which jsdom lacks.
global.ResizeObserver =
  global.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

// react-hot-toast and MUI read prefers-reduced-motion / breakpoints.
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  }));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  store.dispatch(logoutUser());
  window.localStorage.clear();
});
afterAll(() => server.close());
