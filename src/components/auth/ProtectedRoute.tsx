import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'employer' | 'jobseeker';
}

export function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { user, userDetails, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth status
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If userType is specified, check if user has correct type
  if (userType && userDetails?.user_type !== userType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 