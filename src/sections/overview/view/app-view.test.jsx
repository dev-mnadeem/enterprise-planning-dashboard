import { screen, within } from '@testing-library/react';
import { renderWithProviders, signIn } from 'src/test/render';
import { summariseStages } from '../recent-shipments';
import AppView from './app-view';

it('shows real figures and the latest shipments for an admin', async () => {
  signIn({
    name: 'Ama Mensah',
    user_role: { name: 'admin' },
    permissions: [],
    locations: [{ name: 'Tema Port Warehouse' }],
  });
  renderWithProviders(<AppView />);

  const figures = screen.getByRole('region', { name: /key figures/i });
  expect(await within(figures).findByText('active of 3 vehicles')).toBeInTheDocument();
  expect(within(figures).getByText('2')).toBeInTheDocument();
  expect(await screen.findByText('ACM-240311-0042')).toBeInTheDocument();
  expect(screen.getByText('Kumasi → Rotterdam')).toBeInTheDocument();
  expect(screen.getByText(/working from tema port warehouse/i)).toBeInTheDocument();
});

it('only asks for what the role may see', async () => {
  signIn({
    name: 'Fleet clerk',
    user_role: { name: 'fleet' },
    permissions: [{ name: 'Vehicle', properties: { view: true } }],
  });
  renderWithProviders(<AppView />);

  expect(await screen.findByText('active of 3 vehicles')).toBeInTheDocument();
  expect(screen.queryByText('Shipments')).not.toBeInTheDocument();
  expect(screen.queryByText('Latest shipments')).not.toBeInTheDocument();
});

it('summariseStages buckets shipments by their latest scan', () => {
  const counts = Object.fromEntries(
    summariseStages([
      { history: [{ status: 'in' }] },
      { history: [{ status: 'out' }, { status: 'in' }] },
      { history: [] },
      {},
    ]).map((stage) => [stage.key, stage.count])
  );
  expect(counts).toEqual({ booked: 2, in: 1, out: 1 });
});
