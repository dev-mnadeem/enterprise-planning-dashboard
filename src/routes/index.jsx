import AdminRoutes from './Admin';
import { useAppSelector } from 'src/state/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PublicRoutes from './public';
import { USER_ROLE } from 'src/constants';
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
      case USER_ROLE.ADMIN:
        routes = <AdminRoutes />;
        break;

      case USER_ROLE.BRANCH_MANAGER:
        // routes = <BranchManagerRoutes />
        break;

      case USER_ROLE.CUSTOMER:
        // routes = <CustomerRoutes />
        break;

      case USER_ROLE.DRIVER:
        // routes = <DriverRoutes />
        break;

      case USER_ROLE.EMPLOYEE:
        // routes = <EmployeeRoutes />
        break;

      default:
        routes = <></>;
        break;
    }
  }

  return routes;
}
