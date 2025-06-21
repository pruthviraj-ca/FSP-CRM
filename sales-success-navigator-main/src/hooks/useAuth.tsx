import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';
import { apiClient, API_ENDPOINTS } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password
      });

      if (response.error) {
        toast({
          title: "Login failed",
          description: response.error,
          variant: "destructive",
        });
        return false;
      }

      if (response.data?.user) {
        const userData = response.data.user;
        const user: User = {
          id: userData.id.toString(),
          name: `${userData.first_name} ${userData.last_name}`.trim() || userData.username,
          email: userData.email,
          role: userData.role as UserRole,
        };

        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        navigate('/dashboard');
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid response from server",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
