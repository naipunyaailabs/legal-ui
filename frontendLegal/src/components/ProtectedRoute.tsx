import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if this is a public route that doesn't require authentication
  const isPublicRoute = location.pathname.startsWith('/public');

  // If it's a public route, allow access without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !user) {
        // Try to refresh the session
        setIsRefreshing(true);
        try {
          // Try to refresh the token
          const tokenRefreshed = await authService.refreshToken();
          if (tokenRefreshed) {
            // Refresh user data
            await refreshUser();
          } else {
            // If token refresh failed, redirect to auth
            navigate('/auth');
          }
        } catch (error) {
          console.error('Session refresh failed:', error);
          navigate('/auth');
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    checkAuth();
  }, [user, loading, navigate, refreshUser]);

  if (loading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return <>{children}</>;
};