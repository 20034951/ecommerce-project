import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  CreditCard,
  Package,
  Tag,
  ShoppingBag,
  AlertCircle
} from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { toast } from 'react-hot-toast'

// Formatear precio en Quetzales
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

function QuantitySelector({ value, onChange, min = 1, max = 99, disabled }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  
  return (
    <div className="inline-flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || value <= min}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 text-gray-700 dark:text-gray-300"
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value || 0)
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
        }}
        className="w-16 text-center outline-none py-2 bg-transparent text-gray-900 dark:text-white font-semibold border-x-2 border-gray-300 dark:border-gray-700"
        aria-label="Cantidad"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || value >= max}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 text-gray-700 dark:text-gray-300"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cart,
    isLoading,
    updateQuantity,
    removeFromCart,
    totalPrice,
    itemCount,
  } = useCart()

  const handleQtyChange = async (id, qty) => {
    try { 
      await updateQuantity(id, qty)
      toast.success('Cantidad actualizada', { duration: 2000 })
    }
    catch (e) { 
      toast.error('No se pudo actualizar la cantidad') 
    }
  }

  const handleRemove = async (id, name) => {
    try { 
      await removeFromCart(id)
      toast.success(`"${name}" eliminado del carrito`, {
        icon: '🗑️',
        duration: 3000
      })
    }
    catch (e) { 
      toast.error('No se pudo eliminar el producto') 
    }
  }

  const goCheckout = () => {
    if (itemCount === 0) {
      toast.error('Tu carrito está vacío')
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Mi Carrito
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {itemCount === 0 ? 'No hay productos' : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
              </p>
            </div>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Seguir Comprando</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando carrito...</p>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Explora nuestro catálogo y agrega productos a tu carrito para comenzar tu compra.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <Package className="h-5 w-5" />
              Ver Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lista de items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Info Header */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                      Envío gratis en compras mayores a Q 300.00
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {totalPrice >= 300 
                        ? '¡Felicidades! Tienes envío gratis' 
                        : `Te faltan ${formatCurrency(300 - totalPrice)} para envío gratis`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Product List */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/images/products/default.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Precio unitario: {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          disabled={isLoading}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity and Subtotal */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Cantidad:
                          </span>
                          <QuantitySelector
                            value={item.quantity}
                            onChange={(q) => handleQtyChange(item.id, q)}
                            min={1}
                            max={99}
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Subtotal:
                          </span>
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen - Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Resumen
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                      <span className="text-gray-600 dark:text-gray-400">Productos ({itemCount})</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                      <span className="text-gray-600 dark:text-gray-400">Envío</span>
                    </div>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {totalPrice >= 300 ? 'Gratis' : 'A calcular'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mb-6 border-t-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Impuestos incluidos
                  </p>
                </div>

                <button
                  onClick={goCheckout}
                  disabled={itemCount === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-all duration-200 mb-3"
                >
                  <CreditCard className="h-5 w-5" />
                  Proceder al Pago
                </button>

                <Link
                  to="/catalog"
                  className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
                >
                  ← Continuar comprando
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span>Envío seguro y rastreable</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>Garantía de satisfacción</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
