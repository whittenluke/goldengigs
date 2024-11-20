import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'employer' | 'jobseeker';
}

export function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { user, userDetails, loading } = useAuth();
  const location = useLocation();

  // Show loading state or return null while checking auth
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If userType is specified, check if user has correct type
  if (userType && userDetails?.user_type !== userType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 