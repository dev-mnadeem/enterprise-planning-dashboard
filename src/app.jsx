import 'src/global.css';
import Router from 'src/routes';
import ThemeProvider from 'src/theme';
import { store, persistor } from './state/store';
import { Provider } from 'react-redux';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { PersistGate } from 'redux-persist/integration/react';
import AppWrapper from './layouts/AppWrapper';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <AppWrapper>
            <Router />
          </AppWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
