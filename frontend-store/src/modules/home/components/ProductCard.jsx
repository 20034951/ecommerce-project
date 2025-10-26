import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder-product.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${imagePath}`;
  };

  const handleCardClick = (e) => {
    // Si el click fue en el botón del carrito, no navegar
    if (e.target.closest("button")) return;
    navigate(`/products/${product.product_id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.product_id}`);
  };

  // Obtener color de la categoría o usar color por defecto
  const categoryColor = product.category?.color || "#6366F1";
  const categoryEmoji = product.category?.emoji || "📦";

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Imagen del producto */}
      <div className="block relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={getImageUrl(product.image_path)}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold px-3 py-1 bg-red-600 rounded">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido del card */}
      <div className="p-3 flex flex-col flex-1">
        {/* Categoría con emoji */}
        {product.category && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm">{categoryEmoji}</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Título */}
        <h3 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 mb-2 text-sm">
          {product.name}
        </h3>

        {/* Precio y botón */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleCartClick}
            disabled={product.stock === 0}
            style={{
              backgroundColor: product.stock > 0 ? categoryColor : undefined,
            }}
            className="p-2 hover:opacity-90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-all disabled:cursor-not-allowed cursor-pointer"
            title={product.stock === 0 ? "Producto agotado" : "Ver detalles"}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Stock bajo */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
            ¡Solo quedan {product.stock}!
          </div>
        )}
      </div>
    </div>
  );
}
