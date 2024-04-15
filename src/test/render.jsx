import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from 'src/theme';
import { store } from 'src/state/store';
import { storeUser, storeUserSession } from 'src/state/reducers/userReducer';
import { adminUser, makeToken } from './server';

export function signIn(user = adminUser) {
  store.dispatch(storeUserSession({ token: makeToken(user) }));
  store.dispatch(storeUser(user));
}

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ThemeProvider>
    </Provider>
  );
}
