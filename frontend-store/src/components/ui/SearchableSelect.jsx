import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";

/**
 * Componente de Select con buscador
 * @param {Object} props
 * @param {Array} props.options - Array de opciones [{ value, label, ... }]
 * @param {string} props.value - Valor seleccionado
 * @param {Function} props.onChange - Callback al cambiar selección
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.emptyMessage - Mensaje cuando no hay resultados
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Deshabilitar el componente
 */
export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados",
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Obtener la opción seleccionada
  const selectedOption = options.find((opt) => opt.value === value);

  // Filtrar opciones según término de búsqueda
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus en input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5 
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-sm
          text-sm font-medium text-gray-900 dark:text-white
          hover:bg-gray-50 dark:hover:bg-gray-750
          focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
      >
        <span
          className={selectedOption ? "" : "text-gray-500 dark:text-gray-400"}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1">
          {value && !disabled && (
            <div
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 text-sm text-left
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${
                      option.value === value
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                        : "text-gray-900 dark:text-white"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
