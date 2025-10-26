import { Building2, CreditCard, DollarSign, Lock } from "lucide-react";
import { useMemo } from "react";

export default function PaymentMethods({
  selectedMethod,
  onMethodChange,
  paymentMethods = [],
  loading = false,
}) {
  // Mapeo de códigos a iconos de Lucide React
  const iconMap = {
    bank_transfer: Building2,
    credit_card: CreditCard,
    cash_on_delivery: DollarSign,
  };

  // Mapeo de códigos a badges (logos de tarjetas)
  const badgeMap = {
    credit_card: (
      <div className="flex gap-1">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
          alt="Visa"
          className="h-5"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          alt="MasterCard"
          className="h-5"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
          alt="Amex"
          className="h-5"
        />
      </div>
    ),
  };

  // Transformar los datos de la API al formato que espera el componente
  const transformedMethods = useMemo(() => {
    return paymentMethods.map((method) => ({
      id: method.code,
      paymentMethodId: method.payment_method_id,
      name: method.name,
      icon: iconMap[method.code] || DollarSign,
      description: method.description,
      badge: badgeMap[method.code] || null,
    }));
  }, [paymentMethods]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          No hay métodos de pago disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner de seguridad */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            Transacciones 100% seguras y protegidas.
          </p>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="space-y-3">
        {transformedMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id, method.paymentMethodId)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                isSelected
                  ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio button */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-indigo-600 dark:border-indigo-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isSelected
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                    <h3
                      className={`font-medium ${
                        isSelected
                          ? "text-indigo-900 dark:text-indigo-100"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {method.name}
                    </h3>
                  </div>
                  <p
                    className={`text-sm ${
                      isSelected
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {method.description}
                  </p>
                </div>

                {/* Badge (logos) */}
                {method.badge && (
                  <div className="flex-shrink-0">{method.badge}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Instrucciones según método seleccionado */}
      {selectedMethod === "bank_transfer" && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Instrucciones para depositar
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Tienes 24 horas para realizar tu pago y enviar comprobante, de lo
            contrario no podemos asegurar la disponibilidad del producto.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            Te enviaremos un correo con un botón para subir el boucher o
            pantallazo de transferencia.
          </p>
          <div className="mt-3 space-y-1 text-sm text-blue-900 dark:text-blue-100">
            <p>
              <strong>Cuentas monetarias de Ecommerce - StoreGT</strong>
            </p>
            <p>
              Banco Industrial: <strong>999999999</strong>
            </p>
            <p>
              Banrural: <strong>888888888</strong>
            </p>
            <p>
              G&T: <strong>1111111111</strong>
            </p>
          </div>
        </div>
      )}

      {selectedMethod === "cash_on_delivery" && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            Este pedido no requiere anticipo. Paga en efectivo cuando recibas tu
            pedido.
          </p>
        </div>
      )}
    </div>
  );
}
