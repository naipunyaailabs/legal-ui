import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

const Dashboard = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (redirecting) return;
    
    // If still loading, wait for auth state to resolve
    if (loading) return;
    
    // Set redirecting flag to prevent multiple redirects
    setRedirecting(true);
    
    // Get user role from authService
    const userRole = authService.getRole();
    
    // All logged-in users get lawyer mode access
    navigate('/dashboard/lawyer');
    return;
  }, [loading, navigate, redirecting]);

  // Show loading spinner while determining redirect
  if (loading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading and redirecting, just render nothing
  return null;
};

export default Dashboard;