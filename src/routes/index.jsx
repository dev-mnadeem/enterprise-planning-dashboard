import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import {
  ROLE_ADMIN,
  ROLE_BRANCH_MANAGER,
  ROLE_CUSTOMER,
  ROLE_DRIVER,
  ROLE_EMPLOYEE,
} from 'src/constants';

import DashboardLayout from 'src/layouts/dashboard';
import AdminRoutes from './Admin';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  let routes = null;
  const role = 'admin'; // role from API

  switch (role) {
    case ROLE_ADMIN:
      routes = <AdminRoutes />;
      break;

    case ROLE_BRANCH_MANAGER:
      // routes = <BranchManagerRoutes />
      break;

    case ROLE_CUSTOMER:
      // routes = <CustomerRoutes />
      break;

    case ROLE_DRIVER:
      // routes = <DriverRoutes />
      break;

    case ROLE_EMPLOYEE:
      // routes = <EmployeeRoutes />
      break;

    default:
      routes = <></>;
      break;
  }

  return routes;
}
