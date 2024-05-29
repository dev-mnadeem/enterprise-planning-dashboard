import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'src/state/hooks';
import { checkCurrentUserPermission } from 'src/utils';

const PrivateRoute = ({ element: Element, requiredPermission, type }) => {
  const { user } = useAppSelector((state) => state.userReducer);

  const permissions = user?.permissions || [];

  const hasPermission = checkCurrentUserPermission(permissions, requiredPermission, type);

  return !hasPermission ? <Element /> : <Navigate to="/404" replace />;
};

export default PrivateRoute;
