import reducer, { requestFinished, requestStarted, selectIsLoading } from './loadingReducer';

const asRoot = (loadingReducer) => ({ loadingReducer });

it('stays busy until every concurrent request has finished', () => {
  let state = reducer(undefined, { type: 'init' });
  state = reducer(state, requestStarted());
  state = reducer(state, requestStarted());
  state = reducer(state, requestFinished());
  expect(selectIsLoading(asRoot(state))).toBe(true);
  state = reducer(state, requestFinished());
  expect(selectIsLoading(asRoot(state))).toBe(false);
});

it('never goes below zero', () => {
  const state = reducer(reducer(undefined, { type: 'init' }), requestFinished());
  expect(state.pending).toBe(0);
});
