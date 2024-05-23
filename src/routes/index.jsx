import { useAppSelector } from 'src/state/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PublicRoutes from './public';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import ProtectedRoutes from './Protected';
import { jwtDecode } from 'jwt-decode';
// ----------------------------------------------------------------------

export default function Router() {
  useScrollToTop();
  const navigate = useNavigate();
  const { userSession } = useAppSelector((state) => state.userReducer);
  let routes = <PublicRoutes />;

  useEffect(() => {
    if (!userSession) {
      navigate('/login');
    }
  }, [userSession, navigate]);

  if (userSession?.token) {
    routes = <ProtectedRoutes />;
  }

  return routes;
}
