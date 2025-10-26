import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { homeApi } from "../../../api";
import ProductCard from "../components/ProductCard";
import Slider from "../components/Slider";
import HeroSection from "../components/HeroSection";
import { Truck, Shield, CreditCard, HeadphonesIcon } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await homeApi.getHomeData();
        setCategories(data.categories || []);
        setFeaturedProducts(data.featuredProducts || []);
        setCategoryProducts(data.categoryProducts || []);
      } catch (error) {
        console.error("Error cargando datos del home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section con Partículas */}
      <HeroSection />

      {/* Categories Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <Slider title="Categorías" onSeeAll={() => navigate("/categories")}>
          {categories.map((category) => {
            // Usar emoji y color de la BD, o valores por defecto
            const emoji = category.emoji || "📦";
            const color = category.color || "#6B7280";

            return (
              <div
                key={category.category_id}
                onClick={() =>
                  navigate(`/catalog?category=${category.category_id}`)
                }
                className="flex-shrink-0 w-32 cursor-pointer"
              >
                <div className="py-2">
                  <div
                    style={{ backgroundColor: color }}
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 text-4xl hover:scale-110 transition-transform duration-300 shadow-md"
                  >
                    {emoji}
                  </div>
                  <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2 px-1">
                    {category.name}
                  </p>
                </div>
              </div>
            );
          })}
        </Slider>
      </section>

      {/* Featured Products Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8">
        <Slider
          title="🔥 Productos Más Vendidos"
          onSeeAll={() => navigate("/catalog?sort=bestselling")}
        >
          {featuredProducts.map((product) => (
            <div key={product.product_id} className="flex-shrink-0 w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </section>

      {/* Info Panels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-md border-2 border-green-100 dark:border-green-900 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Truck className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white text-lg">
              Envío Gratis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              En pedidos mayores a Q200
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-md border-2 border-blue-100 dark:border-blue-900 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white text-lg">
              Compra Segura
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Protección SSL garantizada
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-md border-2 border-purple-100 dark:border-purple-900 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white text-lg">
              Múltiples Pagos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Acepta todas las tarjetas
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl shadow-md border-2 border-orange-100 dark:border-orange-900 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <HeadphonesIcon className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white text-lg">
              Soporte 24/7
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Siempre listos para ayudarte
            </p>
          </div>
        </div>
      </section>

      {/* Category Products Sliders */}
      {categoryProducts.map((categoryData, index) => {
        // Colores alternados para fondos
        const bgColors = [
          "from-blue-50 to-indigo-50",
          "from-green-50 to-emerald-50",
          "from-purple-50 to-pink-50",
          "from-orange-50 to-amber-50",
        ];
        const bgColor = bgColors[index % bgColors.length];

        // Emoji por defecto si no existe
        const emoji = categoryData.emoji || "📦";

        return (
          <section
            key={categoryData.category_id}
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${bgColor} dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg p-8`}
          >
            <Slider
              title={`${emoji} Lo Mejor en ${categoryData.name}`}
              onSeeAll={() =>
                navigate(`/catalog?category=${categoryData.category_id}`)
              }
            >
              {categoryData.products.map((product) => (
                <div key={product.product_id} className="flex-shrink-0 w-64">
                  <ProductCard product={product} />
                </div>
              ))}
            </Slider>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar a comprar?
          </h2>
          <p className="text-lg mb-8 text-indigo-100">
            Únete a miles de clientes satisfechos y descubre nuestra selección
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Crear Cuenta Gratis
            </button>
            <button
              onClick={() => navigate("/catalog")}
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors border-2 border-white"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
