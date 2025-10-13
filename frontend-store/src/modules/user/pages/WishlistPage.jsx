import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  Button
} from '../../../components/ui';
import { 
  Heart, 
  ShoppingCart, 
  Trash2,
  Star,
  Package,
  DollarSign
} from 'lucide-react';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchWishlist = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWishlistItems([
        {
          id: 1,
          name: 'Auriculares Bluetooth Premium',
          price: 89.99,
          originalPrice: 120.00,
          discount: 25,
          rating: 4.5,
          reviewCount: 128,
          image: '/api/placeholder/300/300',
          inStock: true,
          category: 'Electrónicos',
          addedDate: '2024-01-10'
        },
        {
          id: 2,
          name: 'Reloj Inteligente Deportivo',
          price: 159.99,
          originalPrice: 199.99,
          discount: 20,
          rating: 4.8,
          reviewCount: 89,
          image: '/api/placeholder/300/300',
          inStock: true,
          category: 'Wearables',
          addedDate: '2024-01-08'
        },
        {
          id: 3,
          name: 'Mochila para Laptop 15"',
          price: 45.00,
          originalPrice: 45.00,
          discount: 0,
          rating: 4.3,
          reviewCount: 64,
          image: '/api/placeholder/300/300',
          inStock: false,
          category: 'Accesorios',
          addedDate: '2024-01-05'
        }
      ]);
      setIsLoading(false);
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (item) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', item);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando lista de deseos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Lista de Deseos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'producto guardado' : 'productos guardados'}
        </p>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tu lista de deseos está vacía
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Explora nuestros productos y guarda tus favoritos aquí
            </p>
            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
              <Link to="/products">
                Explorar Productos
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Package className="h-20 w-20 text-gray-400 dark:text-gray-500" />
                  </div>
                  
                  {/* Discount Badge */}
                  {item.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{item.discount}%
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                  
                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <span className="text-white font-semibold bg-gray-900 px-3 py-1 rounded">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({item.reviewCount})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline mb-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`w-full ${
                        item.inStock 
                          ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {item.inStock ? 'Agregar al Carrito' : 'No Disponible'}
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Link to={`/product/${item.id}`}>
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Added Date */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Agregado el {new Date(item.addedDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Card */}
      {wishlistItems.length > 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800 mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-900 dark:text-primary-200 mb-2">
                  Resumen de Lista de Deseos
                </h3>
                <div className="flex items-center space-x-4 text-sm text-primary-800 dark:text-primary-300">
                  <span className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    {wishlistItems.length} productos
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Total: ${wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  const inStockItems = wishlistItems.filter(item => item.inStock);
                  inStockItems.forEach(item => handleAddToCart(item));
                }}
                className="bg-primary-600 hover:bg-primary-700 text-white"
                disabled={!wishlistItems.some(item => item.inStock)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar Todo al Carrito
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}