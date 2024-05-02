import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const PublicRoutes = (props) => {
  return useRoutes([
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

export default PublicRoutes;
