import React from 'react';
import {
  FileText,
  ShoppingCart,
  CreditCard,
  Package,
  RefreshCw,
  Shield,
  AlertCircle,
  Users,
  Lock,
  CheckCircle,
  Mail,
  Calendar
} from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      id: 'acceptance',
      title: 'Aceptación de los Términos',
      icon: FileText,
      color: 'indigo',
      content: [
        'Al acceder y utilizar este sitio web y los servicios de Store, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestro sitio.',
        'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio. Es su responsabilidad revisar periódicamente estos términos.'
      ]
    },
    {
      id: 'account',
      title: 'Cuenta de Usuario',
      icon: Users,
      color: 'blue',
      content: [
        'Para realizar compras en nuestro sitio, debe crear una cuenta proporcionando información precisa y completa.',
        'Es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.',
        'Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta o cualquier otra violación de seguridad.',
        'Nos reservamos el derecho de suspender o cancelar cuentas que violen nuestros términos o que se utilicen para actividades fraudulentas.'
      ]
    },
    {
      id: 'orders',
      title: 'Pedidos y Compras',
      icon: ShoppingCart,
      color: 'emerald',
      content: [
        'Todos los pedidos están sujetos a disponibilidad de productos y confirmación del precio.',
        'Nos reservamos el derecho de rechazar o cancelar cualquier pedido por cualquier motivo, incluyendo pero no limitado a: disponibilidad del producto, errores en el precio o en la descripción del producto, o problemas identificados por nuestro departamento de fraude.',
        'Si su pedido es cancelado después de que su tarjeta de crédito haya sido cargada, emitiremos un crédito inmediato a su cuenta.',
        'Los precios y la disponibilidad están sujetos a cambios sin previo aviso.'
      ]
    },
    {
      id: 'payment',
      title: 'Pagos y Facturación',
      icon: CreditCard,
      color: 'purple',
      content: [
        'Aceptamos diversas formas de pago incluyendo tarjetas de crédito, débito y otros métodos de pago electrónico.',
        'Todos los precios están expresados en Quetzales (Q) e incluyen los impuestos aplicables según la legislación guatemalteca.',
        'El cargo a su tarjeta se realizará en el momento de procesar su pedido.',
        'Garantizamos la seguridad de sus datos de pago mediante encriptación SSL y cumplimiento con los estándares PCI DSS.',
        'En caso de error en el precio, nos reservamos el derecho de cancelar el pedido y reembolsar el monto pagado.'
      ]
    },
    {
      id: 'shipping',
      title: 'Envío y Entrega',
      icon: Package,
      color: 'amber',
      content: [
        'Ofrecemos envío a nivel nacional en Guatemala. Los tiempos de entrega varían según la ubicación y el método de envío seleccionado.',
        'Los costos de envío se calculan según el peso, tamaño del paquete y destino, y se mostrarán antes de finalizar la compra.',
        'Los plazos de entrega son estimados y comienzan a contar desde la confirmación del pedido.',
        'No nos hacemos responsables por retrasos causados por servicios de mensajería de terceros, desastres naturales o eventos fuera de nuestro control.',
        'Es responsabilidad del cliente proporcionar una dirección de entrega precisa y completa.'
      ]
    },
    {
      id: 'returns',
      title: 'Devoluciones y Reembolsos',
      icon: RefreshCw,
      color: 'teal',
      content: [
        'Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto.',
        'Para ser elegible para una devolución, el producto debe estar sin usar, en su empaque original y en las mismas condiciones en que lo recibió.',
        'Los productos en oferta, personalizados o de higiene personal no son elegibles para devolución.',
        'Para iniciar una devolución, contacte a nuestro servicio al cliente con su número de pedido y motivo de devolución.',
        'Los reembolsos se procesarán dentro de 5-7 días hábiles después de recibir y verificar el producto devuelto.',
        'Los costos de envío de devolución son responsabilidad del cliente, excepto en casos de productos defectuosos o errores de nuestra parte.'
      ]
    },
    {
      id: 'warranty',
      title: 'Garantía de Productos',
      icon: Shield,
      color: 'indigo',
      content: [
        'Todos nuestros productos vienen con garantía del fabricante según especificaciones de cada producto.',
        'La garantía cubre defectos de fabricación pero no cubre daños por mal uso, accidentes o desgaste normal.',
        'Para hacer válida la garantía, debe presentar el comprobante de compra y contactar a nuestro servicio al cliente.',
        'La garantía no cubre productos que hayan sido reparados o modificados por terceros no autorizados.',
        'Nos reservamos el derecho de reparar, reemplazar o reembolsar productos defectuosos según corresponda.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacidad y Protección de Datos',
      icon: Lock,
      color: 'rose',
      content: [
        'Nos comprometemos a proteger su privacidad y datos personales de acuerdo con las leyes de protección de datos de Guatemala.',
        'Recopilamos solo la información necesaria para procesar sus pedidos y mejorar nuestros servicios.',
        'No compartimos, vendemos ni alquilamos su información personal a terceros sin su consentimiento.',
        'Utilizamos medidas de seguridad técnicas y organizativas para proteger sus datos contra acceso no autorizado.',
        'Puede solicitar acceso, corrección o eliminación de sus datos personales contactando nuestro equipo de soporte.'
      ]
    },
    {
      id: 'intellectual',
      title: 'Propiedad Intelectual',
      icon: CheckCircle,
      color: 'blue',
      content: [
        'Todo el contenido de este sitio, incluyendo textos, gráficos, logos, imágenes y software, es propiedad de Store o de sus proveedores de contenido.',
        'No puede reproducir, distribuir, modificar o crear obras derivadas sin nuestro permiso expreso por escrito.',
        'Las marcas comerciales mostradas en este sitio son propiedad de sus respectivos dueños.',
        'El uso no autorizado de cualquier material puede violar leyes de derechos de autor, marcas comerciales y otras leyes aplicables.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitación de Responsabilidad',
      icon: AlertCircle,
      color: 'amber',
      content: [
        'Store no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso de nuestros productos o servicios.',
        'Nuestra responsabilidad total no excederá el monto pagado por el producto o servicio en cuestión.',
        'No garantizamos que el sitio estará disponible de forma ininterrumpida o libre de errores.',
        'No somos responsables por el contenido de sitios web de terceros a los que podamos enlazar.'
      ]
    },
    {
      id: 'contact',
      title: 'Contacto y Atención al Cliente',
      icon: Mail,
      color: 'emerald',
      content: [
        'Para cualquier pregunta, consulta o reclamo relacionado con estos términos o nuestros servicios, puede contactarnos a través de:',
        '• Email: soporte@store.com.gt',
        '• Teléfono: +502 2345-6789',
        '• Chat en línea: Disponible en nuestro sitio web de lunes a viernes, 8:00 AM - 6:00 PM',
        'Nos comprometemos a responder todas las consultas dentro de las 24-48 horas hábiles.'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800'
      },
      teal: {
        bg: 'bg-teal-100 dark:bg-teal-900/30',
        icon: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800'
      },
      rose: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        icon: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800'
      }
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Última actualización: 20 de octubre de 2025
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Versión 2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Bienvenido a <span className="font-semibold text-indigo-600 dark:text-indigo-400">Store</span>. 
            Estos Términos y Condiciones rigen el uso de nuestro sitio web y los servicios que ofrecemos. 
            Al utilizar nuestro sitio, usted acepta cumplir con estos términos en su totalidad.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Por favor, lea estos términos cuidadosamente antes de realizar cualquier compra o utilizar nuestros servicios. 
            Si tiene alguna pregunta, no dude en contactarnos.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const colors = getColorClasses(section.color);
            
            return (
              <div
                key={section.id}
                id={section.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Section Header */}
                <div className={`flex items-center gap-4 p-6 border-b ${colors.border}`}>
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6 sm:p-8">
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                Nota Importante
              </h3>
              <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed text-sm sm:text-base">
                Estos términos y condiciones están sujetos a las leyes de la República de Guatemala. 
                Cualquier disputa relacionada con estos términos será resuelta en los tribunales competentes de Guatemala. 
                Al utilizar nuestros servicios, usted acepta la jurisdicción exclusiva de dichos tribunales.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ¿Tienes preguntas sobre nuestros términos?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier duda o consulta.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <Mail className="h-5 w-5" />
              Contáctanos
            </a>
            <a
              href="/help"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              Centro de Ayuda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}