import {
  ROLE_ADMIN,
  ROLE_BRANCH_MANAGER,
  ROLE_CUSTOMER,
  ROLE_DRIVER,
  ROLE_EMPLOYEE,
} from 'src/constants';

import AdminRoutes from './Admin';
import { useAppSelector } from 'src/state/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PublicRoutes from './public';
// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const { userSession } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    if (!userSession) {
      navigate('/login');
    }
  }, [userSession, navigate]);

  let routes = <PublicRoutes />;
  const role = 'admin'; // role from API

  if (userSession?.token) {
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
  }

  return routes;
}
