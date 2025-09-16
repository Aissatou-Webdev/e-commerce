// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, userToken: string) => void;
  logout: () => void;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Vérifier l'état d'authentification au chargement
  const updateAuthState = () => {
    const storedToken = localStorage.getItem('clientToken');
    const storedUser = localStorage.getItem('userInfo');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  const login = (userData: User, userToken: string) => {
    localStorage.setItem('clientToken', userToken);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('clientId');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    updateAuthState
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};