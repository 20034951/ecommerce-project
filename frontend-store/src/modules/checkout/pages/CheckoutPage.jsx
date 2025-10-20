import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ordersApi from '../../../api/orders';
import { useCart } from '../../cart/hooks/useCart';

export default function CheckoutPage() {
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',     // se guarda tal cual (address_line)
    city: '',
    state: '',
    country: 'GT',
    zip: '',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [notes, setNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(true); // el backend lo acepta (aunque creará una fila si no hay addressId)
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) =>
    setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (itemCount === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        customer,
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
          image: i.image ?? null,
        })),
        shippingMethod,
        notes,
        // Si en el futuro eliges una dirección guardada, aquí mandarías addressId
        // addressId,
        saveAddress,
      };

      const resp = await ordersApi.checkout(payload);
      console.log(resp)
      const orderNumber = resp?.orderNumber;

      clearCart();
      toast.success('¡Pedido confirmado!');
      navigate(`/order/success/${orderNumber}`);
    } catch (err) {
      // console.error(err);
      console.log('asdasdasd');
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join(', ') ||
        'No se pudo completar el checkout';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="bg-white border rounded p-6">
          <p className="mb-4 text-gray-600">No tienes artículos en el carrito.</p>
          <Link to="/catalog" className="text-indigo-600 hover:underline">
            Volver al catálogo
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Datos del cliente */}
          <div className="lg:col-span-2 bg-white border rounded p-6 space-y-4">
            <h2 className="text-xl font-semibold">Datos del cliente</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Nombre completo"
                className="border rounded p-2"
                value={customer.fullName}
                onChange={onChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="border rounded p-2"
                value={customer.email}
                onChange={onChange}
                required
              />

              <input
                name="phone"
                placeholder="Teléfono"
                className="border rounded p-2"
                value={customer.phone}
                onChange={onChange}
                required
              />

              <input
                name="address"
                placeholder="Dirección (ej. 6 avenida norte No 50)"
                className="border rounded p-2 sm:col-span-2"
                value={customer.address}
                onChange={onChange}
                required
              />

              <input
                name="city"
                placeholder="Ciudad"
                className="border rounded p-2"
                value={customer.city}
                onChange={onChange}
                required
              />

              <input
                name="zip"
                placeholder="Código Postal (opcional)"
                className="border rounded p-2"
                value={customer.zip}
                onChange={onChange}
              />

              <input
                name="state"
                placeholder="Departamento/Estado (opcional)"
                className="border rounded p-2"
                value={customer.state}
                onChange={onChange}
              />

              <input
                name="country"
                placeholder="País (opcional)"
                className="border rounded p-2"
                value={customer.country}
                onChange={onChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Envío</label>
              <select
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
                className="border rounded p-2"
              >
                <option value="standard">Estándar (3-5 días)</option>
                <option value="express">Express (24-48h)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="saveAddress"
                type="checkbox"
                className="h-4 w-4"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <label htmlFor="saveAddress" className="text-sm">
                Guardar esta dirección para próximos pedidos
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border rounded p-2"
                placeholder="Instrucciones para entrega..."
              />
            </div>
          </div>

          {/* Resumen */}
          <aside className="bg-white border rounded p-6 h-fit">
            <h2 className="text-xl font-semibold mb-3">Resumen</h2>
            <ul className="divide-y">
              {cart.map((it) => (
                <li key={it.id} className="py-2 flex justify-between text-sm">
                  <span className="truncate">
                    {it.name} × {it.quantity}
                  </span>
                  <span>${(Number(it.price) * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${Number(totalPrice).toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg"
            >
              {submitting ? 'Procesando...' : 'Confirmar pedido'}
            </button>
            <Link
              to="/cart"
              className="block text-center text-sm text-indigo-600 hover:underline mt-3"
            >
              Volver al carrito
            </Link>
          </aside>
        </form>
      )}
    </div>
  );
}
