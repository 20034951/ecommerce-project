import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Tag, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCart } from '@/modules/cart/hooks/useCart'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    // Función para formatear precio en Quetzales
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Función para obtener badge de stock
    const getStockInfo = (stock) => {
        if (stock === 0) {
            return { text: 'Agotado', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' };
        } else if (stock <= 10) {
            return { text: 'Pocas unidades', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300' };
        }
        return null;
    };

    const stockInfo = getStockInfo(product.stock || 0);

    const handleCardClick = () => {
        navigate(`/products/${product.product_id}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()

        if (product.stock === 0) {
            toast.error('❌ Producto sin stock disponible', {
                duration: 2000,
                style: {
                    borderRadius: '12px',
                    background: '#ef4444',
                    color: '#fff',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
            });
            return;
        }

        // Normalizamos el ítem al mismo shape que usa el contexto
        const item = {
            id: product.product_id,
            name: product.name,
            price: Number(product.price),
            image: product.image_path
        };

        try {
            // El contexto de carrito usa addToCart(product, quantity)
            addToCart(item, 1);
            
            toast.success(`✅ "${product.name}" agregado al carrito`, {
                duration: 2500,
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
            });
        } catch (error) {
            console.error('Error agregando al carrito:', error);
            toast.error('❌ No se pudo agregar al carrito', {
                style: {
                    borderRadius: '12px',
                    background: '#ef4444',
                    color: '#fff',
                },
            });
        }
    }

    return (
        <div
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={handleCardClick}
        >
            {/* Contenedor de imagen */}
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
                <img
                    src={product.image_path || '/images/products/default.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badge de stock en la esquina superior izquierda */}
                {stockInfo && (
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${stockInfo.color} shadow-sm`}>
                        {stockInfo.text}
                    </div>
                )}

                {/* Botón flotante agregar al carrito */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    title={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 
                        ${product.stock === 0 
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50' 
                            : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white transform group-hover:scale-110 hover:shadow-indigo-500/50'
                        }
                        opacity-0 group-hover:opacity-100`}
                    aria-label={product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                >
                    <ShoppingCart className="h-5 w-5" />
                </button>

                {/* Overlay oscuro sutil al hacer hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>

            {/* Contenido de la card */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Categoría */}
                {product?.category?.name && (
                    <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 mb-2">
                        <Tag className="h-3 w-3" />
                        <span className="font-medium">{product.category.name}</span>
                    </div>
                )}

                {/* Nombre del producto */}
                <h2 className="font-semibold text-base lg:text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                    {product.name}
                </h2>

                {/* Descripción corta si existe */}
                {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Espaciador para empujar el precio al fondo */}
                <div className="flex-grow"></div>

                {/* Precio y stock */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {formatPrice(product.price)}
                        </span>
                        {product.stock > 0 && product.stock <= 10 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {product.stock} disponibles
                            </span>
                        )}
                    </div>

                    {/* Indicador de popularidad (opcional) */}
                    {product.is_featured && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3" />
                            <span className="font-medium">Popular</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Borde inferior animado */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    )
}
