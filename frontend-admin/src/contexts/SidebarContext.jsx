import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(() => {
    // Recuperar estado del localStorage
    const saved = localStorage.getItem('sidebar-minimized');
    return saved ? JSON.parse(saved) : false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Guardar estado en localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-minimized', JSON.stringify(isMinimized));
  }, [isMinimized]);

  const toggleMinimized = () => {
    setIsMinimized(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isMinimized,
        isMobileMenuOpen,
        toggleMinimized,
        toggleMobileMenu,
        closeMobileMenu,
        setIsMinimized,
        setIsMobileMenuOpen
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};