import React, { useState } from "react";

/**
 * Componente de Tabs reutilizable
 * Soporta modo controlado (value + onValueChange) y no controlado (defaultValue)
 */
export const Tabs = ({
  children,
  defaultValue,
  value,
  onValueChange,
  className = "",
}) => {
  const [internalTab, setInternalTab] = useState(defaultValue);

  // Usar valor controlado si se proporciona, sino usar interno
  const activeTab = value !== undefined ? value : internalTab;
  const setActiveTab = (newValue) => {
    if (value !== undefined) {
      // Modo controlado
      onValueChange?.(newValue);
    } else {
      // Modo no controlado
      setInternalTab(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }) => {
  return (
    <div
      className={`flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = "" }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
        isActive
          ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      } ${className}`}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={`mt-6 animate-fadeIn ${className}`} role="tabpanel">
      {children}
    </div>
  );
};

// Context para manejar el estado de tabs
const TabsContext = React.createContext();
