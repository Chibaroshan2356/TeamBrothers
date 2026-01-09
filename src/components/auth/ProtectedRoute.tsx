import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAdmin } = useApp();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isUserAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route requires admin but user is not admin
  if (requireAdmin && !isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
