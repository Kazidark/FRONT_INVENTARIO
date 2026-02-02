import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error al leer auth desde localStorage', error);
      localStorage.removeItem('auth');
      return null;
    }
  });

  /* =========================
     LOGIN
  ========================= */
  const login = (data) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setUser(data);
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK PROTEGIDO
========================= */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider. ' +
      'Verifica que <AuthProvider> envuelva tu aplicación.'
    );
  }

  return context;
};
