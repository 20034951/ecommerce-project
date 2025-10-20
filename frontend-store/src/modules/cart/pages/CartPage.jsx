import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { toast } from 'react-hot-toast'

function QuantitySelector({ value, onChange, min = 1, max = 99, disabled }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div className="inline-flex items-center border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={dec}
        disabled={disabled || value <= min}
        className="px-2 py-1 disabled:opacity-40"
        aria-label="Disminuir"
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
        className="w-14 text-center outline-none py-1"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || value >= max}
        className="px-2 py-1 disabled:opacity-40"
        aria-label="Aumentar"
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
    try { await updateQuantity(id, qty) }
    catch (e) { toast.error('No se pudo actualizar la cantidad') }
  }

  const handleRemove = async (id, name) => {
    try { await removeFromCart(id); toast.success(`"${name}" eliminado del carrito`) }
    catch (e) { toast.error('No se pudo eliminar el producto') }
  }

  const goCheckout = () => {
    if (itemCount === 0) {
      toast.error('Tu carrito está vacío')
      return
    }
    navigate('/checkout')
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>

      {isLoading ? (
        <p className="text-gray-500">Cargando carrito...</p>
      ) : cart.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border">
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link
            to="/catalog"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border rounded-lg p-4"
              >
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || '/images/products/default.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)}</p>

                  <div className="mt-3 flex items-center gap-4">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => handleQtyChange(item.id, q)}
                      min={1}
                      max={99}
                      disabled={isLoading}
                    />
                    <span className="ml-auto font-semibold">
                      Subtotal: ${Number(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 p-2 disabled:opacity-40"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <aside className="bg-white border rounded-lg p-5 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-3">Resumen</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Artículos</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex justify-between font-bold text-indigo-700 text-lg mt-3">
              <span>Total</span>
              <span>${Number(totalPrice).toFixed(2)}</span>
            </div>
            <button
              onClick={goCheckout}
              disabled={itemCount === 0}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg"
            >
              Proceder al pago
            </button>
            <Link
              to="/catalog"
              className="block text-center text-sm text-indigo-600 hover:underline mt-3"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
