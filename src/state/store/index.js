import rootReducer from '../reducers';
import { persistReducer } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
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

// Created once, at module scope. App.jsx used to call persistStore(store) in
// its render body, so a new persistor was built on every render and each one
// dispatched a fresh REHYDRATE -- which overwrote the session that login had
// just stored with the empty state read from disk.
export const persistor = persistStore(store);
