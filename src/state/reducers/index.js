import { combineReducers, createAction } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import loadingReducer from './loadingReducer';

const applicationReducer = combineReducers({
  userReducer,
  loadingReducer,
});

export const logoutUser = createAction('LOGOUT');

const rootReducer = (state, action) => {
  if (logoutUser.type === action.type) {
    return applicationReducer(undefined, action);
  }
  return applicationReducer(state, action);
};

export default rootReducer;
