import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { ShoppingCart, Package, ArrowLeft, Tag, Layers, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import productsApi from '../../../api/products';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../../cart/hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  // Función para formatear precio en Quetzales
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Función para obtener badge de stock
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return {
        text: 'Agotado',
        icon: <XCircle className="h-4 w-4" />,
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      };
    } else if (stock <= 10) {
      return {
        text: `Últimas ${stock} unidades`,
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
      };
    } else {
      return {
        text: 'En stock',
        icon: <CheckCircle className="h-4 w-4" />,
        color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      };
    }
  };

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getById(id);
      setProduct(res);

      if (res.category_id) {
        const relatedRes = await productsApi.getAll({
          category_id: res.category_id,
          limit: 8,
          page: 1,
        });
        const filtered = relatedRes.items.filter(p => p.product_id !== res.product_id);
        setRelated(filtered);
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
      toast.error('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const LOADING = "Cargando producto...";
  const NOT_FOUND = "Producto no encontrado";
  const RELATED = "Productos relacionados";
  const ADD_TO_CART = "Agregar al carrito";

  // 👇 handler real para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      toast.error('Producto sin stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    // Normalizamos el ítem al mismo shape que usa el contexto
    const item = {
      id: product.product_id,
      name: product.name,
      price: Number(product.price),
      image: product.image_path || null,
    };

    try {
      // El contexto de carrito usa addToCart(product, quantity)
      addToCart(item, quantity);
      
      toast.success(
        `✅ ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} agregada${quantity === 1 ? '' : 's'} al carrito`,
        {
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#10b981',
            color: '#fff',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }
      );
      
      setQuantity(1); // Reset quantity
    } catch (e) {
      console.error('Error agregando al carrito:', e);
      toast.error('No se pudo agregar al carrito');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`);
      return;
    }
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          {/* Skeleton Loading */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{NOT_FOUND}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">El producto que buscas no está disponible</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stockBadge = getStockBadge(product.stock || 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
        }}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Botón de volver */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </button>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Imagen del producto */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={product.image_path || '/images/products/default.jpg'}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex flex-col gap-6">
            {/* Categoría */}
            {product.category?.name && (
              <div className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 w-fit">
                <Tag className="h-4 w-4" />
                <span className="font-medium">{product.category.name}</span>
              </div>
            )}

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* SKU si existe */}
            {product.sku && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Layers className="h-4 w-4" />
                <span>SKU: {product.sku}</span>
              </div>
            )}

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Badge de stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm w-fit ${stockBadge.color}`}>
              {stockBadge.icon}
              <span>{stockBadge.text}</span>
            </div>

            {/* Descripción */}
            {product.description && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Descripción
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Selector de cantidad y botón agregar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              {/* Selector de cantidad */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cantidad:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                  >
                    <span className="text-xl text-gray-700 dark:text-gray-300">−</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                  >
                    <span className="text-xl text-gray-700 dark:text-gray-300">+</span>
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.stock} disponibles)
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Subtotal:
                </span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/20"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>{product.stock === 0 ? 'Sin stock' : ADD_TO_CART}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{RELATED}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.product_id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
