import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, signIn } from 'src/test/render';
import { pageOf, rest, server, usersFixture } from 'src/test/server';
import UsersListPage from './users-list';

beforeEach(() => signIn());

it('tells an empty system apart from an empty search', async () => {
  server.use(
    rest.get(/\/users\/?$/, (req, res, ctx) => res(ctx.json(pageOf([], req.url.searchParams))))
  );
  renderWithProviders(<UsersListPage />);

  expect(await screen.findByText('No users yet')).toBeInTheDocument();
});

it('lists users from the API with their role and status', async () => {
  renderWithProviders(<UsersListPage />);

  const row = (await screen.findByText('Kofi Boateng')).closest('tr');
  expect(within(row).getByText('dispatcher')).toBeInTheDocument();
  expect(within(row).getByText('Active')).toBeInTheDocument();
  expect(screen.getByText('Efua Owusu').closest('tr')).toHaveTextContent('Inactive');
});

it('searches on the server and keeps the search box usable', async () => {
  const user = userEvent.setup();
  renderWithProviders(<UsersListPage />);
  await screen.findByText('Kofi Boateng');

  const searchBox = screen.getByPlaceholderText(/search/i);
  await user.type(searchBox, 'efua');

  await waitFor(() => expect(screen.queryByText('Kofi Boateng')).not.toBeInTheDocument());
  expect(screen.getByText('Efua Owusu')).toBeInTheDocument();
  expect(searchBox).toHaveFocus();
});

it('pages through every user, not just the first page the API returns', async () => {
  const many = Array.from({ length: 12 }, (_, i) => ({
    ...usersFixture[0],
    id: `bulk-${i + 1}`,
    name: `Courier ${String(i + 1).padStart(2, '0')}`,
  }));
  const requestedPages = [];
  server.use(
    rest.get(/\/users\/?$/, (req, res, ctx) => {
      requestedPages.push(req.url.searchParams.get('pageNumber'));
      return res(ctx.json(pageOf(many, req.url.searchParams)));
    })
  );
  const user = userEvent.setup();
  renderWithProviders(<UsersListPage />);

  expect(await screen.findByText('1–5 of 12')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /next page/i }));

  expect(await screen.findByText('Courier 06')).toBeInTheDocument();
  expect(requestedPages).toEqual(['1', '2']);
});

it('says so when the request fails', async () => {
  server.use(
    rest.get(/\/users\/?$/, (req, res, ctx) =>
      res(ctx.status(500), ctx.json({ message: 'Database unavailable' }))
    )
  );
  renderWithProviders(<UsersListPage />);

  expect(await screen.findByText(/couldn't load users/i)).toBeInTheDocument();
  expect(screen.getByText('Database unavailable')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
});
