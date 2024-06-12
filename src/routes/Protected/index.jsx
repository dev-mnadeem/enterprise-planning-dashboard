import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, Route } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { PERMISSION_ENTITIES, PERMISSION_TYPE, ROUTES } from 'src/constants';
import _ from 'lodash';
import PrivateRoute from './PrivateRoute';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UsersListPage = lazy(() => import('src/pages/users'));
export const AddUserPage = lazy(() => import('src/pages/users/add-user'));
export const EditUserPage = lazy(() => import('src/pages/users/edit-user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const LocationPage = lazy(() => import('src/pages/locations'));
export const AddLocationPage = lazy(() => import('src/pages/add-location'));
export const EditLocationPage = lazy(() => import('src/pages/edit-location'));
export const PermissionsPage = lazy(() => import('src/pages/permissions'));
export const UserRolesPage = lazy(() => import('src/pages/roles'));
export const AddUserRolePage = lazy(() => import('src/pages/roles/add-role'));
export const EditUserRolePage = lazy(() => import('src/pages/roles/edit-role'));
export const PackagingsPage = lazy(() => import('src/pages/packaging'));
export const AddPackagingPage = lazy(() => import('src/pages/packaging/add-packaging'));
export const EditPackagingPage = lazy(() => import('src/pages/packaging/edit-packaging'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const AddOrderPage = lazy(() => import('src/pages/orders/add-order'));
export const EditOrderPage = lazy(() => import('src/pages/orders/edit-order'));
export const OrdersDetailPage = lazy(() => import('src/pages/order-detail'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const ProtectedRoutes = (props) => {
  const { ADD, VIEW, UPDATE, REMOVE } = PERMISSION_TYPE;
  const { USER, LOCATION, USER_ROLE, PERMISSION, ORDER, PACKAGING } = PERMISSION_ENTITIES;

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
            <PrivateRoute element={LocationPage} requiredPermission={LOCATION} type={VIEW} />
          ),
        },
        {
          path: ROUTES.ADD_LOCATION,
          element: (
            <PrivateRoute element={AddLocationPage} requiredPermission={LOCATION} type={ADD} />
          ),
        },
        {
          path: ROUTES.LOCATION_DETIAL,
          element: (
            <PrivateRoute element={EditLocationPage} requiredPermission={LOCATION} type={UPDATE} />
          ),
        },
        {
          path: ROUTES.USERS,
          element: <PrivateRoute element={UsersListPage} requiredPermission={USER} type={VIEW} />,
        },
        {
          path: ROUTES.ADD_USER,
          element: <PrivateRoute element={AddUserPage} requiredPermission={USER} type={ADD} />,
        },
        {
          path: `${ROUTES.USERS}/:id`,
          element: <PrivateRoute element={EditUserPage} requiredPermission={USER} type={UPDATE} />,
        },
        {
          path: ROUTES.PERMISSIONS,
          element: (
            <PrivateRoute element={PermissionsPage} requiredPermission={PERMISSION} type={VIEW} />
          ),
        },
        {
          path: ROUTES.USER_ROLES,
          element: (
            <PrivateRoute element={UserRolesPage} requiredPermission={USER_ROLE} type={VIEW} />
          ),
        },
        {
          path: ROUTES.ADD_USER_ROLE,
          element: (
            <PrivateRoute element={AddUserRolePage} requiredPermission={USER_ROLE} type={ADD} />
          ),
        },
        {
          path: `${ROUTES.USER_ROLES}/:id`,
          element: (
            <PrivateRoute element={EditUserRolePage} requiredPermission={USER_ROLE} type={UPDATE} />
          ),
        },
        {
          path: ROUTES.PACKAGINGS,
          element: (
            <PrivateRoute element={PackagingsPage} requiredPermission={PACKAGING} type={VIEW} />
          ),
        },
        {
          path: ROUTES.ADD_PACKAGING,
          element: (
            <PrivateRoute element={AddPackagingPage} requiredPermission={PACKAGING} type={ADD} />
          ),
        },
        {
          path: `${ROUTES.PACKAGINGS}/:id`,
          element: (
            <PrivateRoute
              element={EditPackagingPage}
              requiredPermission={PACKAGING}
              type={UPDATE}
            />
          ),
        },
        {
          path: ROUTES.ADD_ORDER,
          element: <PrivateRoute element={AddOrderPage} requiredPermission={ORDER} type={ADD} />,
        },
        {
          path: ROUTES.ORDERS,
          element: <PrivateRoute element={OrdersPage} requiredPermission={ORDER} type={VIEW} />,
        },
        {
          path: ROUTES.ORDER_DETAIL,
          element: (
            <PrivateRoute element={OrdersDetailPage} requiredPermission={ORDER} type={VIEW} />
          ),
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
