import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for existing login state
    const savedUser = localStorage.getItem('skillSwapUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would validate with backend
    const mockUser = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      photo: null
    };
    
    setUser(mockUser);
    setIsLoggedIn(true);
    localStorage.setItem('skillSwapUser', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('skillSwapUser');
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 