import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ShoppingCart,
  ArrowLeft,
  CreditCard,
  MapPin,
  Truck,
  Package,
  User,
  Mail,
  Phone,
  Home,
  FileText,
  CheckCircle,
  Plus,
  MapPinned
} from 'lucide-react';
import ordersApi from '../../../api/orders';
import addressesApi from '../../../api/addresses';
import shippingMethodsApi from '../../../api/shippingMethods';
import { useCart } from '../../cart/hooks/useCart';
import { useAuth } from '../../../auth/AuthProvider';

export default function CheckoutPage() {
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'GT',
    zip: ''
  });

  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [notes, setNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(true);

  // Estados para datos cargados
  const [shippingMethods, setShippingMethods] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Debug: Log cuando cambian los estados
  useEffect(() => {
    console.log('🔄 Estado actualizado - shippingMethods:', shippingMethods);
    console.log('🔄 Estado actualizado - loadingMethods:', loadingMethods);
  }, [shippingMethods, loadingMethods]);

  // Formatear moneda en Quetzales
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Cargar métodos de envío
  useEffect(() => {
    const fetchShippingMethods = async () => {
      console.log('🚀 Iniciando carga de métodos de envío...');
      try {
        const response = await shippingMethodsApi.getAll();
        console.log('📦 Respuesta completa:', response);
        console.log('📦 Tipo de respuesta:', typeof response);
        console.log('📦 ¿Es array?', Array.isArray(response));
        
        // La API devuelve el array directamente (ya pasa por response.data en el API client)
        const methodsArray = Array.isArray(response) ? response : [];
        console.log('✅ Métodos procesados:', methodsArray);
        console.log('✅ Cantidad de métodos:', methodsArray.length);
        
        if (methodsArray.length > 0) {
          setShippingMethods(methodsArray);
          // Preseleccionar el primer método
          setShippingMethodId(methodsArray[0].shipping_method_id);
          console.log('✅ Método preseleccionado:', methodsArray[0].shipping_method_id, methodsArray[0].name);
        } else {
          console.warn('⚠️ No se encontraron métodos de envío');
          setShippingMethods([]);
        }
      } catch (error) {
        console.error('❌ Error cargando métodos de envío:', error);
        console.error('❌ Error completo:', error.response || error);
        toast.error('No se pudieron cargar los métodos de envío');
        setShippingMethods([]);
      } finally {
        setLoadingMethods(false);
        console.log('🏁 Carga de métodos finalizada');
      }
    };

    fetchShippingMethods();
  }, []);

  // Cargar direcciones guardadas
  useEffect(() => {
    const fetchAddresses = async () => {
      console.log('🚀 Iniciando carga de direcciones...');
      try {
        const response = await addressesApi.getAll('shipping');
        console.log('📦 Direcciones - Respuesta completa:', response);
        console.log('📦 Direcciones - Tipo:', typeof response);
        console.log('📦 Direcciones - success:', response?.success);
        console.log('📦 Direcciones - data:', response?.data);
        
        // El httpClient devuelve { success: true, data: [...] }
        const addressesData = Array.isArray(response?.data) ? response.data : [];
        console.log('✅ Direcciones procesadas:', addressesData);
        console.log('✅ Cantidad de direcciones:', addressesData.length);
        
        setAddresses(addressesData);
        if (addressesData.length > 0) {
          setUseNewAddress(false);
          setSelectedAddressId(addressesData[0].address_id);
          console.log('✅ Dirección preseleccionada:', addressesData[0].address_id);
        } else {
          console.log('ℹ️ No hay direcciones guardadas, usando modo nueva dirección');
        }
      } catch (error) {
        console.error('❌ Error cargando direcciones:', error);
        // No mostrar error si no hay direcciones o el usuario no está autenticado
        setAddresses([]);
      } finally {
        setLoadingAddresses(false);
        console.log('🏁 Carga de direcciones finalizada');
      }
    };

    fetchAddresses();
  }, []);

  // Precargar datos del usuario autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Precargando datos del usuario:', user);
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        fullName: user.name || user.full_name || prevCustomer.fullName,
        email: user.email || prevCustomer.email,
        phone: user.phone || prevCustomer.phone
      }));
    }
  }, [isAuthenticated, user]);

  const onChange = (e) =>
    setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (itemCount === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    if (!shippingMethodId) {
      toast.error('Por favor selecciona un método de envío');
      return;
    }

    if (!useNewAddress && !selectedAddressId) {
      toast.error('Por favor selecciona una dirección de envío');
      return;
    }

    try {
      setSubmitting(true);

      // Si usa dirección guardada, enviar solo datos básicos de customer y addressId
      // Si usa nueva dirección, enviar todos los datos de customer
      const customerData = useNewAddress 
        ? {
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state || '',
            country: customer.country || 'GT',
            zip: customer.zip || ''
          }
        : {
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            address: '',
            city: '',
            state: '',
            country: 'GT',
            zip: ''
          };

      const payload = {
        customer: customerData,
        items: cart.map((i) => ({
          productId: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
          image: i.image ?? null,
        })),
        shippingMethodId,
        notes,
        addressId: useNewAddress ? undefined : selectedAddressId,
        saveAddress: useNewAddress ? saveAddress : false,
      };

      console.log('📤 Enviando checkout:', payload);

      const resp = await ordersApi.checkout(payload);
      const orderNumber = resp?.data?.orderNumber || resp?.orderNumber;

      clearCart();
      toast.success('¡Pedido confirmado! Recibirás un correo de confirmación.', {
        duration: 4000,
        icon: '✅'
      });
      navigate(`/order/success/${orderNumber}`);
    } catch (err) {
      console.error('❌ Error en checkout:', err);
      const msg =
        err?.data?.errors?.join(', ') ||
        err?.data?.message ||
        err?.message ||
        'No se pudo completar el checkout';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Calcular costo de envío
  const subtotal = totalPrice;
  const FREE_SHIPPING_THRESHOLD = 300; // Q 300 para envío gratis
  
  // Si el subtotal es >= Q 300, el envío es gratis
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  
  const selectedMethod = Array.isArray(shippingMethods) 
    ? shippingMethods.find((m) => m.shipping_method_id === shippingMethodId)
    : null;
  
  // Si califica para envío gratis, el costo es 0, de lo contrario usar el costo del método
  const shippingCost = qualifiesForFreeShipping ? 0 : (selectedMethod?.cost || 0);
  
  const total = subtotal + Number(shippingCost);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Finalizar Compra
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al Carrito</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega productos a tu carrito para continuar con la compra.
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
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Información del Cliente
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre completo *
                    </div>
                  </label>
                  <input
                    name="fullName"
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                    value={customer.fullName}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo electrónico *
                    </div>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                    value={customer.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono *
                    </div>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="1234-5678"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                    value={customer.phone}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dirección de Envío
                </h2>
              </div>

              {!loadingAddresses && addresses.length > 0 && (
                <div className="mb-6">
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(false)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        !useNewAddress
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <MapPinned className="h-5 w-5 mx-auto mb-1" />
                      Usar dirección guardada
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(true)}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        useNewAddress
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <Plus className="h-5 w-5 mx-auto mb-1" />
                      Nueva dirección
                    </button>
                  </div>

                  {!useNewAddress && (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.address_id}
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedAddressId === addr.address_id
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.address_id}
                            checked={selectedAddressId === addr.address_id}
                            onChange={() => setSelectedAddressId(addr.address_id)}
                            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {addr.address_line}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {addr.city}, {addr.state || ''} {addr.postal_code || ''}
                            </p>
                            {addr.type && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 rounded">
                                {addr.type === 'shipping' ? 'Envío' : 'Facturación'}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {useNewAddress && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Dirección completa *
                      </div>
                    </label>
                    <input
                      name="address"
                      placeholder="Ej: 6 avenida norte No. 50, Zona 1"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                      value={customer.address}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ciudad *
                      </label>
                      <input
                        name="city"
                        placeholder="Ciudad"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                        value={customer.city}
                        onChange={onChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Departamento
                      </label>
                      <input
                        name="state"
                        placeholder="Departamento (opcional)"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                        value={customer.state}
                        onChange={onChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Código Postal
                      </label>
                      <input
                        name="zip"
                        placeholder="Código postal (opcional)"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                        value={customer.zip}
                        onChange={onChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        País
                      </label>
                      <input
                        name="country"
                        placeholder="País"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200"
                        value={customer.country}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="saveAddress"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    <label htmlFor="saveAddress" className="text-sm text-gray-700 dark:text-gray-300">
                      Guardar esta dirección para próximos pedidos
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Método de Envío */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Método de Envío
                </h2>
              </div>

              {(() => {
                console.log('=== RENDERIZADO MÉTODOS DE ENVÍO ===');
                console.log('loadingMethods:', loadingMethods);
                console.log('shippingMethods:', shippingMethods);
                console.log('shippingMethods.length:', shippingMethods.length);
                console.log('qualifiesForFreeShipping:', qualifiesForFreeShipping);
                console.log('subtotal:', subtotal);
                return null;
              })()}

              {/* Mensaje de envío gratis */}
              {qualifiesForFreeShipping && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      ¡Felicitaciones! Tu compra califica para <span className="font-bold">envío gratis</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Barra de progreso para envío gratis */}
              {!qualifiesForFreeShipping && subtotal > 0 && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Agrega {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} más para obtener envío gratis
                      </p>
                      <div className="mt-2 w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                        <div 
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loadingMethods ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400"></div>
                </div>
              ) : shippingMethods.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No hay métodos de envío disponibles</p>
              ) : (
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const methodCost = parseFloat(method.cost);
                    const isFreeMethod = methodCost === 0;
                    const displayCost = qualifiesForFreeShipping ? 0 : methodCost;
                    
                    return (
                      <label
                        key={method.shipping_method_id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          shippingMethodId === method.shipping_method_id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.shipping_method_id}
                            checked={shippingMethodId === method.shipping_method_id}
                            onChange={() => setShippingMethodId(method.shipping_method_id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </p>
                            {method.region && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {method.region}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {qualifiesForFreeShipping ? (
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                Gratis
                              </span>
                              {!isFreeMethod && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 line-through">
                                  {formatCurrency(methodCost)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {isFreeMethod ? 'Gratis' : formatCurrency(methodCost)}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Notas del Pedido
                </h2>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="Instrucciones especiales para la entrega (opcional)..."
              />
            </div>
          </div>

          {/* Resumen del Pedido */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Resumen del Pedido
                </h2>
              </div>

              {/* Productos */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/images/products/default.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({itemCount} productos)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  </div>
                  <div className="text-right">
                    {qualifiesForFreeShipping ? (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Gratis
                        </span>
                        {selectedMethod && parseFloat(selectedMethod.cost) > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500 line-through ml-1">
                            {formatCurrency(selectedMethod.cost)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white">
                        {parseFloat(shippingCost) === 0 ? 'Gratis' : formatCurrency(shippingCost)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Impuestos incluidos
                  </p>
                </div>
              </div>

              {/* Botón de enviar */}
              <button
                type="submit"
                disabled={submitting || loadingMethods}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Pedido
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="block text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mt-4 transition-colors duration-200"
              >
                ← Modificar carrito
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center flex-shrink-0">
                    <Package className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Recibirás confirmación por correo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center flex-shrink-0">
                    <Truck className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>Envío rastreable</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
        )}
      </div>
    </div>
  );
}
