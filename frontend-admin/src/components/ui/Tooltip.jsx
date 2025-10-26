import React, { useState } from "react";
import { Info } from "lucide-react";

/**
 * Componente Tooltip para mostrar información adicional
 * @param {string} content - Contenido del tooltip
 * @param {React.ReactNode} children - Elemento que activará el tooltip (opcional)
 */
export const Tooltip = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className="cursor-help inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children || (
          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        )}
      </div>

      {isVisible && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-72 max-w-sm">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="whitespace-pre-line">{content}</div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
