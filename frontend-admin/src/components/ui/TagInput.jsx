import React, { useState, useRef } from "react";
import { X, Tag as TagIcon } from "lucide-react";

/**
 * Componente de input para agregar tags
 * @param {Array} tags - Array de strings con los tags actuales
 * @param {Function} onChange - Callback cuando cambian los tags
 * @param {string} placeholder - Placeholder del input
 * @param {number} maxLength - Máximo de caracteres por tag (default: 50)
 * @param {boolean} disabled - Si el input está deshabilitado
 */
export function TagInput({
  tags = [],
  onChange,
  placeholder = "Escribe un tag y presiona Enter...",
  maxLength = 50,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Si el input está vacío y presionas backspace, eliminar el último tag
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError("El tag no puede estar vacío");
      return;
    }

    if (trimmedValue.length > maxLength) {
      setError(`El tag no puede tener más de ${maxLength} caracteres`);
      return;
    }

    if (tags.includes(trimmedValue)) {
      setError("Este tag ya existe");
      return;
    }

    onChange([...tags, trimmedValue]);
    setInputValue("");
    setError("");
    inputRef.current?.focus();
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
    setError("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // No permitir que escriba más del máximo
    if (value.length > maxLength) {
      setError(`Máximo ${maxLength} caracteres`);
      return;
    }

    setInputValue(value);
    setError("");
  };

  return (
    <div className="space-y-2">
      {/* Contenedor principal con border */}
      <div
        className={`
          relative min-h-[42px] w-full rounded-lg border bg-white dark:bg-gray-800 
          ${
            error
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 dark:focus-within:border-indigo-400"
          }
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2 p-2">
          {/* Tags existentes */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium group"
            >
              <TagIcon className="h-3 w-3" />
              <span className="max-w-[200px] truncate">{tag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                disabled={disabled}
                className="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5 transition-colors duration-200"
                aria-label={`Eliminar tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Input para nuevo tag */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            disabled={disabled}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Mensaje de error o ayuda */}
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600 dark:bg-red-400"></span>
          {error}
        </p>
      ) : (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Escribe un tag y presiona{" "}
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono text-xs">
            Enter
          </kbd>{" "}
          para agregarlo. Máximo {maxLength} caracteres. ({inputValue.length}/
          {maxLength})
        </p>
      )}

      {/* Contador de tags */}
      {tags.length > 0 && (
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {tags.length} {tags.length === 1 ? "tag agregado" : "tags agregados"}
        </p>
      )}
    </div>
  );
}

export default TagInput;
