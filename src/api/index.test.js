import { interceptedAxios } from './index';
import { signIn } from 'src/test/render';
import { makeToken } from 'src/test/server';

const runInterceptor = (config = { headers: {} }) =>
  interceptedAxios.interceptors.request.handlers[0].fulfilled(config);

it('sends the session token as a bearer header', () => {
  signIn();
  expect(runInterceptor().headers.Authorization).toBe(`Bearer ${makeToken()}`);
});

it('sends no Authorization header without a session', () => {
  expect(runInterceptor().headers.Authorization).toBeUndefined();
});
