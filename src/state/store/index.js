import rootReducer from '../reducers';
import { persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import localStorage from 'redux-persist/es/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: localStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
