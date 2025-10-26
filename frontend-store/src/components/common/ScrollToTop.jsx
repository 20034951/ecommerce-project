import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

/**
 * Botón flotante para hacer scroll hasta arriba de la página
 * Se muestra solo cuando el usuario ha hecho scroll hacia abajo
 */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Detectar scroll para mostrar/ocultar el botón
  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón si el usuario ha hecho scroll más de 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Agregar listener al scroll
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Función para hacer scroll suave hasta arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer fixed bottom-6 right-6 z-50 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Volver arriba"
          title="Volver arriba"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
