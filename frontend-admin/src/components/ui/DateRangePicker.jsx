import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

/**
 * Componente DateRangePicker usando react-tailwindcss-datepicker
 * @param {Object} value - { startDate: Date, endDate: Date }
 * @param {Function} onChange - Callback cuando cambia la fecha
 * @param {boolean} showShortcuts - Mostrar shortcuts de rango
 * @param {string} primaryColor - Color primario (indigo, blue, etc)
 * @param {string} placeholder - Placeholder del input
 * @param {boolean} disabled - Deshabilitar el picker
 */
export const DateRangePicker = ({
  value,
  onChange,
  showShortcuts = true,
  primaryColor = "indigo",
  placeholder = "Seleccionar rango de fechas",
  disabled = false,
}) => {
  return (
    <Datepicker
      primaryColor={primaryColor}
      value={value}
      onChange={onChange}
      showShortcuts={showShortcuts}
      placeholder={placeholder}
      disabled={disabled}
      displayFormat="DD/MM/YYYY"
      separator="-"
      inputClassName="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
      toggleClassName="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      containerClassName="relative"
      configs={{
        shortcuts: {
          today: "Hoy",
          yesterday: "Ayer",
          past: (period) => `Últimos ${period} días`,
          currentMonth: "Mes actual",
          pastMonth: "Mes pasado",
        },
      }}
    />
  );
};

export default DateRangePicker;
