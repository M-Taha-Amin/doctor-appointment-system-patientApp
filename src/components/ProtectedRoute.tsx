import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = () => {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
