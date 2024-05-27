import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, Route } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { PERMISSION_TYPE, ROUTES } from 'src/constants';
import _ from 'lodash';
import PrivateRoute from './PrivateRoute';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UsersListPage = lazy(() => import('src/pages/users'));
export const AddUserPage = lazy(() => import('src/pages/users/add-user'));
export const EditUserPage = lazy(() => import('src/pages/users/edit-user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const LocationPage = lazy(() => import('src/pages/locations'));
export const AddLocationPage = lazy(() => import('src/pages/add-location'));
export const EditLocationPage = lazy(() => import('src/pages/edit-location'));
export const PermissionsPage = lazy(() => import('src/pages/permissions'));
export const UserRolesPage = lazy(() => import('src/pages/roles'));
export const AddUserRolePage = lazy(() => import('src/pages/roles/add-role'));
export const EditUserRolePage = lazy(() => import('src/pages/roles/edit-role'));
export const ShipmentsListPage = lazy(() => import('src/pages/shipments'));
export const AddShipmentPage = lazy(() => import('src/pages/shipments/add-shipment'));
export const EditShipmentPage = lazy(() => import('src/pages/shipments/edit-shipment'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const ProtectedRoutes = (props) => {
  const { ADD, VIEW, UPDATE, REMOVE } = PERMISSION_TYPE;

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
        {
          path: ROUTES.LOCATIONS,
          element: (
            <PrivateRoute element={LocationPage} requiredPermission="Location" type="view" />
          ),
        },
        {
          path: ROUTES.ADD_LOCATION,
          element: (
            <PrivateRoute element={AddLocationPage} requiredPermission="Location" type="add" />
          ),
        },
        {
          path: ROUTES.LOCATION_DETIAL,
          element: (
            <PrivateRoute element={EditLocationPage} requiredPermission="Location" type="update" />
          ),
        },
        {
          path: ROUTES.USERS,
          element: <PrivateRoute element={UsersListPage} requiredPermission="User" type={VIEW} />,
        },
        {
          path: ROUTES.ADD_USER,
          element: <PrivateRoute element={AddUserPage} requiredPermission="User" type={ADD} />,
        },
        {
          path: `${ROUTES.USERS}/:id`,
          element: <PrivateRoute element={EditUserPage} requiredPermission="User" type={UPDATE} />,
        },
        {
          path: ROUTES.PERMISSIONS,
          element: (
            <PrivateRoute element={PermissionsPage} requiredPermission="Permission" type={VIEW} />
          ),
        },
        {
          path: ROUTES.USER_ROLES,
          element: (
            <PrivateRoute element={UserRolesPage} requiredPermission="UserRole" type={VIEW} />
          ),
        },
        {
          path: ROUTES.ADD_USER_ROLE,
          element: (
            <PrivateRoute element={AddUserRolePage} requiredPermission="UserRole" type={ADD} />
          ),
        },
        {
          path: `${ROUTES.USER_ROLES}/:id`,
          element: (
            <PrivateRoute element={EditUserRolePage} requiredPermission="UserRole" type={UPDATE} />
          ),
        },
        // {
        //   path: ROUTES.SHIPMENTS,
        //   element: (
        //     <PrivateRoute element={ShipmentsListPage} requiredPermission="Shipment" type={VIEW} />
        //   ),
        // },
        {
          path: ROUTES.ADD_SHIPMENT,
          element: <AddShipmentPage />,
        },
        // {
        //   path: `${ROUTES.SHIPMENTS}/:id`,
        //   element: (
        //     <PrivateRoute element={EditUserRolePage} requiredPermission="UserRole" type={UPDATE} />
        //   ),
        // },

        {
          path: ROUTES.ORDERS,
          element: <OrdersPage />,
        },
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

export default ProtectedRoutes;
