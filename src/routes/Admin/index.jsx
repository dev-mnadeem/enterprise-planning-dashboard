import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { ROUTES } from 'src/constants';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UsersListPage = lazy(() => import('src/pages/users'));
export const AddUserPage = lazy(() => import('src/pages/users/add-user'));
export const EditUserPage = lazy(() => import('src/pages/users/edit-user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LocationPage = lazy(() => import('src/pages/locations'));
export const AddLocationPage = lazy(() => import('src/pages/add-location'));
export const EditLocationPage = lazy(() => import('src/pages/edit-location'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const AdminRoutes = (props) => {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'locations', element: <LocationPage /> },
        { path: 'locations/add', element: <AddLocationPage /> },
        { path: 'locations/:id', element: <EditLocationPage /> },
        { path: ROUTES.USERS, element: <UsersListPage /> },
        { path: ROUTES.ADD_USER, element: <AddUserPage /> },
        { path: `${ROUTES.USERS}/:id`, element: <EditUserPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
};

export default AdminRoutes;
