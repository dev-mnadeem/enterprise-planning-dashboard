import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, signIn } from 'src/test/render';
import PrivateRoute from './PrivateRoute';

const VehiclesPage = () => <p>Vehicles page</p>;

const renderAt = () =>
  renderWithProviders(
    <Routes>
      <Route
        path="/vehicles"
        element={<PrivateRoute element={VehiclesPage} requiredPermission="Vehicle" type="view" />}
      />
      <Route path="/404" element={<p>Not found</p>} />
    </Routes>,
    { route: '/vehicles' }
  );

it('renders the page when the role grants the action', () => {
  signIn({
    name: 'Dispatcher',
    user_role: { name: 'dispatcher' },
    permissions: [{ name: 'Vehicle', properties: { view: true } }],
  });
  renderAt();
  expect(screen.getByText('Vehicles page')).toBeInTheDocument();
});

it('sends other roles to 404 instead of crashing', () => {
  signIn({
    name: 'Clerk',
    user_role: { name: 'clerk' },
    permissions: [{ name: 'Order', properties: { view: true } }],
  });
  renderAt();
  expect(screen.getByText('Not found')).toBeInTheDocument();
});
