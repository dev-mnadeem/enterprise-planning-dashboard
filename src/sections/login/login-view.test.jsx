import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { renderWithProviders } from 'src/test/render';
import { adminUser } from 'src/test/server';
import { store } from 'src/state/store';
import LoginView from './login-view';

const renderLogin = () =>
  renderWithProviders(
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<p>Operations overview</p>} />
      </Routes>
    </>,
    { route: '/login' }
  );

it('signs in, stores the decoded user and moves to the dashboard', async () => {
  const user = userEvent.setup();
  renderLogin();

  await user.type(screen.getByLabelText(/email address/i), adminUser.email);
  await user.type(screen.getByLabelText(/^password/i), 'correct-horse');
  await user.click(screen.getByRole('button', { name: /^login$/i }));

  expect(await screen.findByText('Operations overview')).toBeInTheDocument();
  const { user: stored, userSession } = store.getState().userReducer;
  expect(userSession.token).toEqual(expect.any(String));
  expect(stored).toMatchObject({ name: adminUser.name, locations: [{ id: 'loc-1' }] });
});

it('shows the API message and stays put on bad credentials', async () => {
  const user = userEvent.setup();
  renderLogin();

  await user.type(screen.getByLabelText(/email address/i), adminUser.email);
  await user.type(screen.getByLabelText(/^password/i), 'wrong');
  await user.click(screen.getByRole('button', { name: /^login$/i }));

  expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  await waitFor(() => expect(store.getState().userReducer.userSession).toBeUndefined());
  expect(screen.queryByText('Operations overview')).not.toBeInTheDocument();
});
