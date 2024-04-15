import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, signIn } from 'src/test/render';
import { rest, server } from 'src/test/server';
import UsersListPage from './users-list';

beforeEach(() => signIn());

it('lists users from the API with their role and status', async () => {
  renderWithProviders(<UsersListPage />);

  const row = (await screen.findByText('Kofi Boateng')).closest('tr');
  expect(within(row).getByText('dispatcher')).toBeInTheDocument();
  expect(within(row).getByText('Active')).toBeInTheDocument();
  expect(screen.getByText('Efua Owusu').closest('tr')).toHaveTextContent('Inactive');
});

it('filters the table by name', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UsersListPage />);
  await screen.findByText('Kofi Boateng');

  await user.type(screen.getByPlaceholderText(/search/i), 'efua');

  expect(screen.queryByText('Kofi Boateng')).not.toBeInTheDocument();
  expect(screen.getByText('Efua Owusu')).toBeInTheDocument();
});

it('says so when the request fails', async () => {
  server.use(
    rest.get(/\/users\/?$/, (req, res, ctx) =>
      res(ctx.status(500), ctx.json({ message: 'Database unavailable' }))
    )
  );
  renderWithProviders(<UsersListPage />);

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});
