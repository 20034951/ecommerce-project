import { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

/**
 * Componente que controla la aplicación de la clase 'dark' al documento
 * para que Tailwind CSS pueda aplicar los estilos de modo oscuro
 */
export function ThemeController() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return null; // Este componente no renderiza nada
}