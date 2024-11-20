import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'employer' | 'jobseeker';
}

export function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { user, userDetails, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user, redirect to login with return URL
  if (!user) {
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // If userType is specified, check if user has correct type
  if (userType && userDetails?.user_type !== userType) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 