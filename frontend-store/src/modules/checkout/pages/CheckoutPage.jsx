import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  MapPinned,
} from "lucide-react";
import ordersApi from "../../../api/orders";
import addressesApi from "../../../api/addresses";
import shippingMethodsApi from "../../../api/shippingMethods";
import { useCart } from "../../cart/hooks/useCart";
import { useAuth } from "../../../auth/AuthProvider";
import CouponInput from "../components/CouponInput";

export default function CheckoutPage() {
  const { cart, totalPrice, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "GT",
    zip: "",
  });

  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [notes, setNotes] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(true);

  // Estados para datos cargados
  const [shippingMethods, setShippingMethods] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Coupon states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(totalPrice);

  // Coupon handlers
  const handleCouponApplied = (couponData) => {
    setAppliedCoupon(couponData);
    setDiscountAmount(couponData.discountAmount);
    setFinalTotal(couponData.finalTotal);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFinalTotal(totalPrice);
  };

  // Update final total when cart total changes
  useEffect(() => {
    if (!appliedCoupon) {
      setFinalTotal(totalPrice);
    }
  }, [totalPrice, appliedCoupon]);

  // Debug: Log cuando cambian los estados
  useEffect(() => {
    console.log("🔄 Estado actualizado - shippingMethods:", shippingMethods);
    console.log("🔄 Estado actualizado - loadingMethods:", loadingMethods);
  }, [shippingMethods, loadingMethods]);

  // Formatear moneda
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

  // Cargar métodos de envío
  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const response = await shippingMethodsApi.getAll();
        const methodsArray = Array.isArray(response) ? response : [];
        setShippingMethods(methodsArray);
        if (methodsArray.length > 0)
          setShippingMethodId(methodsArray[0].shipping_method_id);
      } catch (error) {
        console.error("Error cargando métodos de envío:", error);
        toast.error("No se pudieron cargar los métodos de envío");
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchShippingMethods();
  }, []);

  // Cargar direcciones guardadas
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressesApi.getAll("shipping");
        const addressesData = Array.isArray(response?.data)
          ? response.data
          : [];
        setAddresses(addressesData);
        if (addressesData.length > 0) {
          setUseNewAddress(false);
          setSelectedAddressId(addressesData[0].address_id);
        }
      } catch {
        setAddresses([]);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // Precargar datos del usuario autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomer((prevCustomer) => ({
        ...prevCustomer,
        fullName: user.name || user.full_name || prevCustomer.fullName,
        email: user.email || prevCustomer.email,
        phone: user.phone || prevCustomer.phone,
      }));
    }
  }, [isAuthenticated, user]);

  const onChange = (e) =>
    setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));

  // Calcular costos
  const subtotal = totalPrice;
  const FREE_SHIPPING_THRESHOLD = 300;
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const selectedMethod = shippingMethods.find(
    (m) => m.shipping_method_id === shippingMethodId
  );
  const shippingCost = qualifiesForFreeShipping ? 0 : selectedMethod?.cost || 0;
  const total = finalTotal + Number(shippingCost);

  // Updated checkout submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (itemCount === 0) return toast.error("Tu carrito está vacío");
    if (!shippingMethodId) return toast.error("Selecciona un método de envío");
    if (!useNewAddress && !selectedAddressId)
      return toast.error("Selecciona una dirección de envío");

    try {
      setSubmitting(true);

      const customerData = useNewAddress
        ? { ...customer }
        : {
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
          };

      // Calculate final total with shipping
      const calculatedTotal = finalTotal + Number(shippingCost);

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
        totalAmount: calculatedTotal,
        couponCode: appliedCoupon?.code || null,
        couponId: appliedCoupon?.coupon_id || null,
      };

      console.log("📤 Checkout payload:", payload);
      const resp = await ordersApi.checkout(payload);
      const orderNumber = resp?.data?.orderNumber || resp?.orderNumber;

      clearCart();
      toast.success("¡Pedido confirmado! Recibirás un correo de confirmación.");
      navigate(`/order/success/${orderNumber}`);
    } catch (err) {
      console.error("Error en checkout:", err);
      const msg =
        err?.data?.message ||
        err?.message ||
        "No se pudo completar el checkout";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
                {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu
                carrito
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
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega productos para continuar con la compra
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Ver Productos
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Información Personal
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre Completo
                      </div>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customer.fullName}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={onChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Dirección de Envío
                  </h2>
                </div>

                {addresses.length > 0 && (
                  <div className="mb-6">
                    <div className="flex gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setUseNewAddress(false)}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          !useNewAddress
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                        }`}
                      >
                        <MapPinned className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-medium">
                          Dirección Guardada
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseNewAddress(true)}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                          useNewAddress
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                        }`}
                      >
                        <Plus className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-medium">
                          Nueva Dirección
                        </span>
                      </button>
                    </div>

                    {!useNewAddress && (
                      <select
                        value={selectedAddressId || ""}
                        onChange={(e) =>
                          setSelectedAddressId(Number(e.target.value))
                        }
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">Selecciona una dirección</option>
                        {addresses.map((addr) => (
                          <option key={addr.address_id} value={addr.address_id}>
                            {addr.address_line}, {addr.city}
                            {addr.state ? `, ${addr.state}` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {useNewAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Dirección
                        </div>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={customer.address}
                        onChange={onChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customer.city}
                        onChange={onChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={customer.zip}
                        onChange={onChange}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>

                    {isAuthenticated && (
                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Guardar esta dirección para futuros pedidos
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Método de Envío
                  </h2>
                </div>

                {loadingMethods ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.shipping_method_id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          shippingMethodId === method.shipping_method_id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.shipping_method_id}
                            checked={
                              shippingMethodId === method.shipping_method_id
                            }
                            onChange={() =>
                              setShippingMethodId(method.shipping_method_id)
                            }
                            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {method.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">
                            {formatCurrency(method.cost)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {method.estimated_days} días
                          </div>
                        </div>
                      </label>
                    ))}

                    {qualifiesForFreeShipping && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">
                            ¡Envío gratis! Tu pedido supera Q
                            {FREE_SHIPPING_THRESHOLD}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
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
                  placeholder="Instrucciones especiales de entrega, preferencias, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200 resize-none"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
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

                {/* Coupon Input */}
                <div className="mb-4">
                  <CouponInput
                    orderTotal={totalPrice}
                    onCouponApplied={handleCouponApplied}
                    onCouponRemoved={handleCouponRemoved}
                  />
                </div>

                {/* Order Items */}
                <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary with Discount and Shipping */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                      <span>Descuento ({appliedCoupon.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Envío</span>
                    <span>
                      {qualifiesForFreeShipping ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ¡Gratis!
                        </span>
                      ) : (
                        formatCurrency(shippingCost)
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

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
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
