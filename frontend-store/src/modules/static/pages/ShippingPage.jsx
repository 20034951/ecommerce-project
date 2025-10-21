import React from 'react';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Box,
  Home,
  Building2,
  Plane,
  Timer,
  Calendar,
  Shield,
  Info,
  Zap,
  PackageCheck
} from 'lucide-react';

export default function ShippingPage() {
  const shippingMethods = [
    {
      id: 1,
      name: 'Envío Estándar',
      icon: Package,
      color: 'blue',
      deliveryTime: '5-7 días hábiles',
      price: 'Q 25.00',
      description: 'Servicio de envío regular con seguimiento incluido',
      features: [
        'Seguimiento en línea',
        'Entrega en días hábiles',
        'Seguro básico incluido',
        'Notificaciones por email'
      ]
    },
    {
      id: 2,
      name: 'Envío Express',
      icon: Zap,
      color: 'purple',
      deliveryTime: '2-3 días hábiles',
      price: 'Q 50.00',
      description: 'Envío rápido con prioridad en procesamiento',
      features: [
        'Procesamiento prioritario',
        'Seguimiento en tiempo real',
        'Seguro completo incluido',
        'Notificaciones SMS y email'
      ]
    },
    {
      id: 3,
      name: 'Envío Premium',
      icon: Plane,
      color: 'indigo',
      deliveryTime: '24-48 horas',
      price: 'Q 100.00',
      description: 'Entrega ultra rápida para pedidos urgentes',
      features: [
        'Entrega garantizada',
        'Seguimiento premium',
        'Seguro total incluido',
        'Atención al cliente 24/7'
      ]
    },
    {
      id: 4,
      name: 'Recogida en Tienda',
      icon: Home,
      color: 'emerald',
      deliveryTime: '2-4 horas',
      price: 'Gratis',
      description: 'Recoge tu pedido en nuestra tienda física',
      features: [
        'Sin costo de envío',
        'Disponible el mismo día',
        'Verificación en persona',
        'Horario extendido'
      ]
    }
  ];

  const coverageZones = [
    {
      zone: 'Zona 1 - Ciudad de Guatemala',
      icon: Building2,
      color: 'indigo',
      areas: ['Zonas 1-25 de la Ciudad de Guatemala'],
      deliveryTime: '1-2 días hábiles',
      cost: 'Q 25.00'
    },
    {
      zone: 'Zona 2 - Municipios Cercanos',
      icon: Home,
      color: 'blue',
      areas: ['Mixco', 'Villa Nueva', 'San Miguel Petapa', 'Villa Canales'],
      deliveryTime: '2-3 días hábiles',
      cost: 'Q 35.00'
    },
    {
      zone: 'Zona 3 - Departamentos Centrales',
      icon: MapPin,
      color: 'emerald',
      areas: ['Sacatepéquez', 'Chimaltenango', 'Escuintla'],
      deliveryTime: '3-5 días hábiles',
      cost: 'Q 45.00'
    },
    {
      zone: 'Zona 4 - Resto del País',
      icon: Truck,
      color: 'purple',
      areas: ['Todos los demás departamentos de Guatemala'],
      deliveryTime: '5-7 días hábiles',
      cost: 'Q 60.00'
    }
  ];

  const trackingSteps = [
    {
      title: 'Pedido Confirmado',
      description: 'Su pedido ha sido recibido y está siendo procesado',
      icon: CheckCircle,
      color: 'indigo'
    },
    {
      title: 'En Preparación',
      description: 'Estamos preparando sus productos para el envío',
      icon: Box,
      color: 'blue'
    },
    {
      title: 'En Tránsito',
      description: 'Su pedido está en camino a su dirección',
      icon: Truck,
      color: 'purple'
    },
    {
      title: 'Entregado',
      description: 'Su pedido ha sido entregado exitosamente',
      icon: PackageCheck,
      color: 'emerald'
    }
  ];

  const faqs = [
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Una vez que su pedido sea enviado, recibirá un número de seguimiento por correo electrónico. Puede usar este número en nuestra página de seguimiento o en el sitio web de la empresa de mensajería.',
      icon: MapPin,
      color: 'indigo'
    },
    {
      question: '¿Realizan envíos a todo Guatemala?',
      answer: 'Sí, realizamos envíos a todos los departamentos de Guatemala. Los tiempos de entrega y costos varían según la zona de cobertura.',
      icon: Truck,
      color: 'blue'
    },
    {
      question: '¿Qué sucede si no estoy en casa al momento de la entrega?',
      answer: 'El mensajero intentará contactarlo telefónicamente. Si no hay nadie disponible, dejará un aviso y programará una nueva entrega, o puede recoger el paquete en la oficina más cercana.',
      icon: Home,
      color: 'emerald'
    },
    {
      question: '¿Puedo cambiar la dirección de entrega después de realizar el pedido?',
      answer: 'Puede cambiar la dirección de entrega contactando a nuestro servicio al cliente dentro de las primeras 24 horas después de realizar el pedido, antes de que sea enviado.',
      icon: AlertCircle,
      color: 'amber'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'hover:border-indigo-300 dark:hover:border-indigo-700'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:border-blue-300 dark:hover:border-blue-700'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'hover:border-emerald-300 dark:hover:border-emerald-700'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:border-purple-300 dark:hover:border-purple-700'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400',
        hover: 'hover:border-amber-300 dark:hover:border-amber-700'
      },
      teal: {
        bg: 'bg-teal-100 dark:bg-teal-900/30',
        icon: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-600 dark:text-teal-400',
        hover: 'hover:border-teal-300 dark:hover:border-teal-700'
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-6">
              <Truck className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Información de Envíos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enviamos a todo Guatemala con diferentes opciones para que recibas tu pedido 
              de la manera más conveniente para ti.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Free Shipping Notice */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                Envío Gratis en Compras Mayores a Q 300
              </h3>
              <p className="text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
                Disfruta de envío gratuito en toda la Ciudad de Guatemala para pedidos superiores a Q 300.00. 
                ¡Aprovecha esta oferta y ahorra en tus compras!
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Métodos de Envío
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Elige el método que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingMethods.map((method) => {
              const Icon = method.icon;
              const colors = getColorClasses(method.color);
              
              return (
                <div
                  key={method.id}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-200 hover:shadow-lg`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`h-7 w-7 ${colors.icon}`} />
                  </div>

                  {/* Title and Price */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {method.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-2xl font-bold ${colors.text}`}>
                      {method.price}
                    </span>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{method.deliveryTime}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className={`h-4 w-4 ${colors.icon} flex-shrink-0 mt-0.5`} />
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coverage Zones */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
              <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Zonas de Cobertura
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Costos y tiempos de entrega según tu ubicación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coverageZones.map((zone, index) => {
              const Icon = zone.icon;
              const colors = getColorClasses(zone.color);
              
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {zone.zone}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {zone.areas.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Tiempo de entrega
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {zone.deliveryTime}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Costo
                        </span>
                      </div>
                      <p className={`text-sm font-semibold ${colors.text}`}>
                        {zone.cost}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracking Process */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Seguimiento de tu Pedido
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mantente informado del estado de tu envío en cada etapa
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                const colors = getColorClasses(step.color);
                const isLast = index === trackingSteps.length - 1;
                
                return (
                  <div key={index} className="relative">
                    {/* Connector Line */}
                    {!isLast && (
                      <div className="hidden md:block absolute top-8 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-gray-200 dark:bg-gray-800" />
                    )}

                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-900`}>
                        <Icon className={`h-7 w-7 ${colors.icon}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Información Importante
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Timer className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Tiempo de Procesamiento
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Los pedidos se procesan de lunes a viernes de 8:00 AM a 5:00 PM. 
                      Los pedidos realizados después de las 3:00 PM se procesan el siguiente día hábil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Seguro de Envío
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Todos los envíos incluyen seguro básico. Para productos de alto valor, 
                      recomendamos contratar seguro adicional al momento de la compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Días Festivos
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No realizamos envíos en días festivos nacionales. Los tiempos de entrega 
                      pueden extenderse durante temporadas de alta demanda como Navidad y Año Nuevo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Requisitos de Entrega
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Se requiere que una persona mayor de 18 años esté presente para recibir el paquete 
                      y firmar el comprobante de entrega. Se solicitará identificación con fotografía.
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
              Respuestas a las preguntas más comunes sobre envíos
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
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl mb-6">
            <Truck className="h-7 w-7 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Necesitas ayuda con tu envío?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para resolver todas tus dudas sobre envíos, 
            seguimiento y entregas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <Package className="h-5 w-5" />
              Rastrear Pedido
            </a>
            <a
              href="mailto:envios@store.com.gt"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              Contactar Envíos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}