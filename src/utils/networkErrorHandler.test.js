import { networkErrorHandler } from './networkErrorHandler';

const httpError = (status, data) => ({
  message: `Request failed with status code ${status}`,
  response: { status, data },
});

describe('networkErrorHandler', () => {
  it('uses the API message on a 4xx', () => {
    expect(networkErrorHandler(httpError(401, { message: 'Token expired' }))).toBe('Token expired');
  });

  it('reads validation constraints when there is no message', () => {
    const err = httpError(400, { error: [{ constraints: { isLength: 'name is too short' } }] });
    expect(networkErrorHandler(err)).toBe('name is too short');
  });

  it('uses the API message on a 5xx', () => {
    expect(networkErrorHandler(httpError(500, { message: 'Database unavailable' }))).toBe(
      'Database unavailable'
    );
  });

  it('falls back to the transport error when there is no response', () => {
    expect(networkErrorHandler({ message: 'Network Error' })).toBe('Network Error');
  });
});
