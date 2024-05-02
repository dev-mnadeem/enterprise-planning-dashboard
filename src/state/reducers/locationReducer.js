import { createSlice } from '@reduxjs/toolkit';
import { LocationDummy } from 'src/sections/locations/utils';

export const initialAppState = {
  locations: [...LocationDummy],
};

export const locationSlice = createSlice({
  name: 'locationReducer',
  initialState: initialAppState,
  reducers: {
    addLocation: (state, action) => {
      return {
        ...state,
        locations: [...state.locations, action.payload],
      };
    },
    deleteLocation: (state, action) => {
      const filtered = state.locations.filter((location) => location.id !== action.payload);

      return {
        ...state,
        locations: filtered,
      };
    },

    updateLocation: (state, action) => {
      const tempLocations = state.locations.map((item) => {
        if (item.id === action.payload.id) {
          return { ...action.payload };
        } else {
          return item;
        }
      });

      return {
        ...state,
        locations: tempLocations,
      };
    },
  },
});

export const { addLocation, deleteLocation, updateLocation } = locationSlice.actions;

export default locationSlice.reducer;
