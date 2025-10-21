import React from 'react';
import {
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  Truck,
  FileText,
  Mail,
  Phone,
  Shield,
  Box,
  Calendar,
  ArrowLeft,
  ListChecks,
  Ban
} from 'lucide-react';

export default function ReturnsPage() {
  const steps = [
    {
      number: 1,
      title: 'Inicie su solicitud',
      description: 'Acceda a su cuenta y seleccione el pedido que desea devolver',
      icon: FileText,
      color: 'indigo'
    },
    {
      number: 2,
      title: 'Empaque el producto',
      description: 'Empaque el artículo en su caja original con todos los accesorios',
      icon: Box,
      color: 'blue'
    },
    {
      number: 3,
      title: 'Envíe el producto',
      description: 'Utilice la guía de envío proporcionada para devolver el artículo',
      icon: Truck,
      color: 'emerald'
    },
    {
      number: 4,
      title: 'Reciba su reembolso',
      description: 'Una vez verificado, procesaremos su reembolso en 5-7 días hábiles',
      icon: CreditCard,
      color: 'purple'
    }
  ];

  const eligibleCriteria = [
    {
      icon: CheckCircle,
      title: 'Dentro de 30 días',
      description: 'El producto debe devolverse dentro de los 30 días posteriores a la compra',
      color: 'emerald'
    },
    {
      icon: Package,
      title: 'Estado original',
      description: 'El producto debe estar sin usar y en su empaque original',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Con comprobante',
      description: 'Debe presentar la factura o comprobante de compra',
      color: 'indigo'
    },
    {
      icon: Shield,
      title: 'Etiquetas intactas',
      description: 'Las etiquetas y sellos de seguridad deben estar intactos',
      color: 'purple'
    }
  ];

  const nonEligible = [
    {
      icon: Ban,
      title: 'Productos de higiene personal',
      description: 'Por razones de salud y seguridad',
      color: 'red'
    },
    {
      icon: Ban,
      title: 'Productos personalizados',
      description: 'Artículos hechos bajo pedido específico',
      color: 'red'
    },
    {
      icon: Ban,
      title: 'Ofertas especiales marcadas',
      description: 'Productos en liquidación o venta final',
      color: 'amber'
    },
    {
      icon: Ban,
      title: 'Productos dañados por mal uso',
      description: 'Artículos con daños causados por el cliente',
      color: 'amber'
    }
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo tarda el proceso de reembolso?',
      answer: 'Una vez que recibamos y verifiquemos el producto devuelto, procesaremos su reembolso dentro de 5-7 días hábiles. El tiempo que tarde en reflejarse en su cuenta bancaria puede variar según su institución financiera.',
      icon: Clock,
      color: 'indigo'
    },
    {
      question: '¿Quién paga el envío de devolución?',
      answer: 'Si el producto está defectuoso o hubo un error de nuestra parte, cubriremos los costos de envío. En otros casos, los gastos de envío de devolución son responsabilidad del cliente.',
      icon: Truck,
      color: 'blue'
    },
    {
      question: '¿Puedo cambiar un producto por otro?',
      answer: 'Actualmente no ofrecemos intercambios directos. Deberá devolver el producto original y realizar una nueva compra del artículo deseado.',
      icon: RefreshCw,
      color: 'emerald'
    },
    {
      question: '¿Qué hago si recibí un producto defectuoso?',
      answer: 'Contacte inmediatamente a nuestro servicio al cliente con fotos del defecto. Procesaremos un reembolso completo o reemplazo sin costo de envío para usted.',
      icon: AlertTriangle,
      color: 'amber'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-600 dark:text-indigo-400'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-600 dark:text-emerald-400'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400'
      },
      teal: {
        bg: 'bg-teal-100 dark:bg-teal-900/30',
        icon: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-600 dark:text-teal-400'
      }
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-6">
              <RefreshCw className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Política de Devoluciones
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Queremos que esté completamente satisfecho con su compra. Si no lo está, 
              estamos aquí para ayudarle con nuestro proceso de devolución simple y transparente.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important Notice */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                30 Días de Garantía de Devolución
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
                Aceptamos devoluciones dentro de los 30 días posteriores a la recepción de su pedido. 
                El producto debe estar en perfectas condiciones y en su empaque original.
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Proceso de Devolución
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Siga estos simples pasos para devolver su producto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              const colors = getColorClasses(step.color);
              
              return (
                <div
                  key={step.number}
                  className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200"
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-3 -left-3 w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center border-4 border-white dark:border-gray-950`}>
                    <span className={`text-lg font-bold ${colors.text}`}>
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 mt-2`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eligible Products */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
              <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Criterios de Elegibilidad
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Para ser elegible para una devolución, su producto debe cumplir con estos requisitos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {eligibleCriteria.map((criteria, index) => {
              const Icon = criteria.icon;
              const colors = getColorClasses(criteria.color);
              
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} p-6 hover:shadow-md transition-all duration-200`}
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {criteria.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {criteria.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Non-Eligible Products */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Productos No Elegibles para Devolución
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nonEligible.map((item, index) => {
                const Icon = item.icon;
                const colors = getColorClasses(item.color);
                
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <Icon className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Refund Methods */}
        <div className="mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Métodos de Reembolso
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Tarjeta de Crédito/Débito
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Si pagó con tarjeta, el reembolso se acreditará a la misma tarjeta utilizada para la compra 
                      original. Puede tardar 5-10 días hábiles en reflejarse según su banco.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Crédito en Tienda
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Opcionalmente, puede optar por recibir el reembolso como crédito en tienda, 
                      que estará disponible de inmediato y puede usarse en futuras compras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Transferencia Bancaria
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Para compras pagadas por transferencia, el reembolso se procesará a la misma cuenta bancaria 
                      en un plazo de 3-5 días hábiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Encuentre respuestas a las preguntas más comunes sobre devoluciones
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const colors = getColorClasses(faq.color);
              
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className={`flex items-center gap-4 p-6 border-b ${colors.border}`}>
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-6">
            <Mail className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Necesita ayuda con una devolución?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nuestro equipo de atención al cliente está disponible para ayudarle con su solicitud 
            de devolución y responder cualquier pregunta que pueda tener.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              Ver Mis Pedidos
            </a>
            <a
              href="mailto:soporte@store.com.gt"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              <Mail className="h-5 w-5" />
              Contactar Soporte
            </a>
            <a
              href="tel:+50223456789"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              <Phone className="h-5 w-5" />
              +502 2345-6789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}