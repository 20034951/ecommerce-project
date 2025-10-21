import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ShoppingCart,
  CreditCard,
  Truck,
  RefreshCw,
  User,
  Shield,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  MapPin,
  FileText,
  Package,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'orders',
      title: 'Pedidos y Compras',
      icon: ShoppingCart,
      color: 'indigo',
      topics: [
        '¿Cómo realizar un pedido?',
        '¿Puedo modificar mi pedido?',
        '¿Cómo cancelo un pedido?',
        'Estado de mi pedido'
      ]
    },
    {
      id: 'payment',
      title: 'Pagos y Facturación',
      icon: CreditCard,
      color: 'purple',
      topics: [
        'Métodos de pago aceptados',
        'Facturación electrónica',
        'Problemas con el pago',
        'Reembolsos y devoluciones'
      ]
    },
    {
      id: 'shipping',
      title: 'Envíos y Entregas',
      icon: Truck,
      color: 'blue',
      topics: [
        'Tiempos de entrega',
        'Rastrear mi pedido',
        'Costos de envío',
        'Zonas de cobertura'
      ]
    },
    {
      id: 'returns',
      title: 'Devoluciones',
      icon: RefreshCw,
      color: 'emerald',
      topics: [
        'Política de devoluciones',
        'Cómo devolver un producto',
        'Productos no elegibles',
        'Tiempo de reembolso'
      ]
    },
    {
      id: 'account',
      title: 'Mi Cuenta',
      icon: User,
      color: 'teal',
      topics: [
        'Crear una cuenta',
        'Recuperar contraseña',
        'Actualizar información',
        'Eliminar mi cuenta'
      ]
    },
    {
      id: 'security',
      title: 'Seguridad y Privacidad',
      icon: Shield,
      color: 'red',
      topics: [
        'Protección de datos',
        'Seguridad de pagos',
        'Política de privacidad',
        'Términos y condiciones'
      ]
    }
  ];

  const popularQuestions = [
    {
      question: '¿Cuánto tiempo tarda en llegar mi pedido?',
      answer: 'Los tiempos de entrega varían según tu ubicación: 1-2 días en Ciudad de Guatemala, 3-5 días en departamentos centrales, y 5-7 días en el resto del país.',
      icon: Clock,
      color: 'blue'
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Una vez enviado tu pedido, recibirás un código de rastreo por email. Puedes seguir tu envío en la sección "Mis Pedidos" de tu cuenta.',
      icon: MapPin,
      color: 'purple'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias y pago contra entrega en zonas seleccionadas.',
      icon: CreditCard,
      color: 'indigo'
    },
    {
      question: '¿Puedo devolver un producto?',
      answer: 'Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar sin usar y en su empaque original.',
      icon: RefreshCw,
      color: 'emerald'
    },
    {
      question: '¿Hay envío gratis?',
      answer: 'Sí, ofrecemos envío gratuito en la Ciudad de Guatemala para compras mayores a Q 300.00.',
      icon: Truck,
      color: 'teal'
    },
    {
      question: '¿Cómo puedo cambiar mi dirección de entrega?',
      answer: 'Puedes actualizar tu dirección desde tu perfil en "Mis Direcciones". Si ya realizaste el pedido, contacta a soporte dentro de las primeras 24 horas.',
      icon: Package,
      color: 'amber'
    }
  ];

  const contactMethods = [
    {
      title: 'Chat en Línea',
      description: 'Chatea con nuestro equipo de soporte',
      icon: MessageCircle,
      color: 'indigo',
      action: 'Iniciar Chat',
      availability: 'Lun - Vie: 8:00 AM - 6:00 PM',
      link: '#chat'
    },
    {
      title: 'Email',
      description: 'Envíanos un correo electrónico',
      icon: Mail,
      color: 'blue',
      action: 'soporte@store.com.gt',
      availability: 'Respuesta en 24-48 horas',
      link: 'mailto:soporte@store.com.gt'
    },
    {
      title: 'Teléfono',
      description: 'Llámanos para asistencia inmediata',
      icon: Phone,
      color: 'emerald',
      action: '+502 2345-6789',
      availability: 'Lun - Vie: 8:00 AM - 6:00 PM',
      link: 'tel:+50223456789'
    }
  ];

  const quickLinks = [
    { title: 'Estado de Pedido', icon: Package, link: '/orders', color: 'purple' },
    { title: 'Devoluciones', icon: RefreshCw, link: '/returns', color: 'emerald' },
    { title: 'Información de Envíos', icon: Truck, link: '/shipping', color: 'blue' },
    { title: 'Política de Privacidad', icon: Shield, link: '/privacy', color: 'red' },
    { title: 'Términos y Condiciones', icon: FileText, link: '/terms', color: 'indigo' },
    { title: 'Mi Cuenta', icon: User, link: '/profile', color: 'teal' }
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
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        hover: 'hover:border-red-300 dark:hover:border-red-700'
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6">
              <HelpCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              ¿En qué podemos ayudarte hoy? Encuentra respuestas a tus preguntas o contáctanos directamente.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help Categories */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Categorías de Ayuda
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explora nuestras categorías para encontrar lo que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              const colors = getColorClasses(category.color);
              
              return (
                <div
                  key={category.id}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-200 hover:shadow-lg cursor-pointer group`}
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {category.title}
                  </h3>
                  
                  <ul className="space-y-2">
                    {category.topics.map((topic, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-200">
                        <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Las respuestas a las preguntas más comunes de nuestros clientes
            </p>
          </div>

          <div className="space-y-4">
            {popularQuestions.map((item, index) => {
              const Icon = item.icon;
              const colors = getColorClasses(item.color);
              
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
                      {item.question}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Enlaces Rápidos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Accesos directos a las páginas más útiles
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              const colors = getColorClasses(link.color);
              
              return (
                <a
                  key={index}
                  href={link.link}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-4 transition-all duration-200 hover:shadow-lg text-center group`}
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {link.title}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Contáctanos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Elige el método de contacto que prefieras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const colors = getColorClasses(method.color);
              
              return (
                <a
                  key={index}
                  href={method.link}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-200 hover:shadow-lg text-center group`}
                >
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>
                  
                  <p className={`text-base font-semibold ${colors.text} mb-2`}>
                    {method.action}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{method.availability}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Help Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Estamos Aquí para Ayudarte
              </h3>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-sm sm:text-base">
                Nuestro equipo de atención al cliente está comprometido con tu satisfacción. 
                Si no encuentras la respuesta que buscas, no dudes en contactarnos directamente. 
                Responderemos tu consulta lo antes posible.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Recursos Adicionales
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Documentación adicional que puede ser de tu interés
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/terms"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Términos y Condiciones
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
            </a>

            <a
              href="/privacy"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Política de Privacidad
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
            </a>

            <a
              href="/returns"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Política de Devoluciones
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200" />
            </a>

            <a
              href="/shipping"
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Información de Envíos
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}