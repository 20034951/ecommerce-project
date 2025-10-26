import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

/**
 * Input dinámico con debounce para filtros de top N
 */
export const DynamicTopInput = ({
  value,
  onChange,
  min = 1,
  max = 1000,
  placeholder = "Ej: 10",
  label = "Mostrar top",
  debounceMs = 2000,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setIsTyping(true);

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Validar que sea un número válido
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      // Establecer nuevo timeout
      timeoutRef.current = setTimeout(() => {
        onChange(numValue);
        setIsTyping(false);
      }, debounceMs);
    } else if (newValue === "") {
      // Si está vacío, también activar después del debounce
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, debounceMs);
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
        />
        {isTyping && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {isTyping && (
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Filtrando...
        </span>
      )}
    </div>
  );
};

export default DynamicTopInput;
