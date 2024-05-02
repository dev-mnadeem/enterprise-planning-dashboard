import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: undefined,
  userSession: undefined,
};

export const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    storeUser: (state, action) => {
      return { ...state, user: action.payload };
    },

    storeUserSession: (state, action) => {
      return { ...state, userSession: action.payload };
    },
    updateUser: (state, action) => {
      return {
        ...state,
        user: { ...action.payload },
      };
    },
  },
});

export const { storeUser, updateUser, storeUserSession } = userSlice.actions;
export default userSlice.reducer;
