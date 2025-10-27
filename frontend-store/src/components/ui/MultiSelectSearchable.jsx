import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check } from "lucide-react";

/**
 * Componente de Multi-Select con buscador
 * @param {Object} props
 * @param {Array} props.options - Array de opciones [{ value, label, emoji, color, ... }]
 * @param {Array} props.values - Array de valores seleccionados
 * @param {Function} props.onChange - Callback al cambiar selección (recibe array de valores)
 * @param {string} props.placeholder - Placeholder del input
 * @param {string} props.emptyMessage - Mensaje cuando no hay resultados
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Deshabilitar el componente
 * @param {number} props.maxDisplay - Máximo de items a mostrar en el trigger antes de mostrar "+X"
 */
export default function MultiSelectSearchable({
  options = [],
  values = [],
  onChange,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados",
  className = "",
  disabled = false,
  maxDisplay = 2,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Obtener opciones seleccionadas
  const selectedOptions = options.filter((opt) => values.includes(opt.value));

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

  const handleSelect = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter((v) => v !== optionValue)
      : [...values, optionValue];

    onChange(newValues);
  };

  const handleRemove = (optionValue, e) => {
    e.stopPropagation();
    const newValues = values.filter((v) => v !== optionValue);
    onChange(newValues);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm("");
  };

  const renderTriggerContent = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
      );
    }

    const displayedOptions = selectedOptions.slice(0, maxDisplay);
    const remainingCount = selectedOptions.length - maxDisplay;

    return (
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        {displayedOptions.map((option) => {
          const optionColor = option.color || "#6366f1";
          const hasEmoji = option.emoji && option.emoji.trim() !== "";

          return (
            <span
              key={option.value}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${optionColor}20`,
                color: optionColor,
              }}
            >
              {hasEmoji && (
                <span className="text-sm" role="img" aria-label={option.label}>
                  {option.emoji}
                </span>
              )}
              {option.label}
              <span
                onClick={(e) => handleRemove(option.value, e)}
                className="rounded p-0.5 transition-colors cursor-pointer"
                style={{
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${optionColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X className="w-3 h-3" />
              </span>
            </span>
          );
        })}
        {remainingCount > 0 && (
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-3 py-2.5 min-h-[42px]
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
        <div className="flex-1 min-w-0">{renderTriggerContent()}</div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {values.length > 0 && !disabled && (
            <span
              onClick={handleClearAll}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </span>
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
              filteredOptions.map((option) => {
                const isSelected = values.includes(option.value);
                const optionColor = option.color || "#6366f1";
                const hasEmoji = option.emoji && option.emoji.trim() !== "";

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 text-sm text-left
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      transition-colors duration-150
                      ${
                        isSelected
                          ? "font-medium"
                          : "text-gray-900 dark:text-white"
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${optionColor}15`,
                            color: optionColor,
                          }
                        : {}
                    }
                  >
                    <span className="flex items-center gap-2">
                      {hasEmoji && (
                        <span
                          className="text-lg"
                          role="img"
                          aria-label={option.label}
                        >
                          {option.emoji}
                        </span>
                      )}
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check
                        className="w-4 h-4"
                        style={{ color: optionColor }}
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </div>
            )}
          </div>

          {/* Footer con contador */}
          {values.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  {values.length}{" "}
                  {values.length === 1 ? "seleccionada" : "seleccionadas"}
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Limpiar todo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
