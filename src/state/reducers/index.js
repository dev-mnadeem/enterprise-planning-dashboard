import userReducer from './userReducer';
import locationReducer from './locationReducer';
import { combineReducers, createAction } from '@reduxjs/toolkit';
import loadingReducer from './loadingReducer';

const applicationReducer = combineReducers({
  userReducer: userReducer,
  locationReducer: locationReducer,
  loadingReducer: loadingReducer,
});

export const logoutUser = createAction('LOGOUT');

const rootReducer = (state, action) => {
  if (logoutUser.type === action.type) {
    return applicationReducer(undefined, action);
  }
  return applicationReducer(state, action);
};

export default rootReducer;
