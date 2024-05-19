import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: false,
};

const loadingSlice = createSlice({
  name: 'loadingReducer',
  initialState,
  reducers: {
    setLoadingActive(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setLoadingActive } = loadingSlice.actions;
export default loadingSlice.reducer;
