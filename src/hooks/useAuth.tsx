import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, User } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'lawyer' | 'public';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateRole: (newRole: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const initAuth = async () => {
      try {
        const currentUser = authService.getUser();
        const currentRole = authService.getRole();

        if (currentUser) {
          setUser(currentUser);
          setRole(currentRole);

          // Try to refresh user data from server
          const refreshedUser = await authService.refreshUser();
          if (refreshedUser) {
            setUser(refreshedUser);
            if (refreshedUser.role) {
              setRole(refreshedUser.role);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear auth data if there's an error
        authService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, selectedRole: UserRole, displayName?: string) => {
    try {
      setLoading(true);
      const { user: newUser, token } = await authService.register({
        email,
        password,
        display_name: displayName,
        role: selectedRole
      });

      setUser(newUser);
      setRole(selectedRole);

      toast.success('Account created successfully!');
      // Navigate to the appropriate dashboard based on selected role
      navigate(`/dashboard/${selectedRole}`);
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 409) {
        errorMessage = 'User already exists';
      } else if (error.status === 400) {
        errorMessage = 'Please check your input and try again';
      }

      toast.error(errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: authenticatedUser, token } = await authService.login({
        email,
        password
      });

      setUser(authenticatedUser);
      setRole(authenticatedUser.role || 'public');

      toast.success('Welcome back!');
      // Navigate to the appropriate dashboard based on user role
      navigate(`/dashboard/${authenticatedUser.role || 'public'}`);
      return { error: null };
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.status === 400) {
        errorMessage = 'Please check your input and try again';
      }

      toast.error(errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();

      setUser(null);
      setRole(null);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    }
  };

  const updateRole = async (newRole: UserRole) => {
    try {
      await authService.setRole(newRole);
      setRole(newRole);
      toast.success(`Switched to ${newRole === 'lawyer' ? 'Lawyer' : 'Public'} Mode`);

      // Navigate to appropriate dashboard
      navigate(`/dashboard/${newRole}`);
    } catch (error: any) {
      toast.error('Failed to update role');
      console.error('Role update error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const refreshedUser = await authService.refreshUser();
      if (refreshedUser) {
        setUser(refreshedUser);
        if (refreshedUser.role) {
          setRole(refreshedUser.role);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signUp, signIn, signOut, updateRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};