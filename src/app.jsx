import 'src/global.css';
import Router from 'src/routes';
import ThemeProvider from 'src/theme';
import { store } from './state/store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  useScrollToTop();
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
