import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from 'src/theme';
import { store } from 'src/state/store';
import { storeUser, storeUserSession } from 'src/state/reducers/userReducer';
import { ROUTER_FUTURE } from 'src/layouts/AppWrapper';
import { adminUser, makeToken } from './server';

export function signIn(user = adminUser) {
  store.dispatch(storeUserSession({ token: makeToken(user) }));
  store.dispatch(storeUser(user));
}

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]} future={ROUTER_FUTURE}>
          {ui}
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}
