import { createSlice } from '@reduxjs/toolkit';

// A counter rather than a flag: screens fire several requests at once, and the
// first one to finish used to clear the overlay while the others were in flight.
const initialState = {
  pending: 0,
};

const loadingSlice = createSlice({
  name: 'loadingReducer',
  initialState,
  reducers: {
    requestStarted(state) {
      state.pending += 1;
    },
    requestFinished(state) {
      state.pending = Math.max(0, state.pending - 1);
    },
  },
});

export const { requestStarted, requestFinished } = loadingSlice.actions;
export const selectIsLoading = (state) => state.loadingReducer.pending > 0;
export default loadingSlice.reducer;
