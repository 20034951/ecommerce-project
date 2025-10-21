import React from 'react';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Cookie,
  Share2,
  FileText,
  AlertCircle,
  CheckCircle,
  Mail,
  Calendar,
  UserCheck,
  Settings,
  Globe,
  Bell
} from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introducción',
      icon: Shield,
      color: 'indigo',
      content: [
        'En Store, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, compartimos y protegemos su información personal cuando utiliza nuestro sitio web y servicios.',
        'Nos comprometemos a ser transparentes sobre nuestras prácticas de datos y a darle control sobre su información personal.',
        'Al utilizar nuestro sitio web, usted acepta las prácticas descritas en esta política. Si no está de acuerdo con esta política, por favor no utilice nuestros servicios.'
      ]
    },
    {
      id: 'information-collected',
      title: 'Información que Recopilamos',
      icon: Database,
      color: 'blue',
      content: [
        'Recopilamos diferentes tipos de información para proporcionar y mejorar nuestros servicios:',
        '• Información de Cuenta: Nombre, dirección de correo electrónico, número de teléfono, dirección de entrega y facturación.',
        '• Información de Pago: Datos de tarjetas de crédito o débito (procesados de forma segura por nuestros proveedores de pago certificados).',
        '• Información de Pedidos: Historial de compras, productos favoritos, reseñas y calificaciones.',
        '• Información Técnica: Dirección IP, tipo de navegador, sistema operativo, páginas visitadas y tiempo de navegación.',
        '• Cookies y Tecnologías Similares: Utilizamos cookies para mejorar su experiencia de navegación y personalizar el contenido.'
      ]
    },
    {
      id: 'how-we-use',
      title: 'Cómo Utilizamos su Información',
      icon: Eye,
      color: 'emerald',
      content: [
        'Utilizamos la información recopilada para los siguientes propósitos:',
        '• Procesar y completar sus pedidos, incluyendo el envío y la facturación.',
        '• Comunicarnos con usted sobre sus pedidos, consultas y actualizaciones de cuenta.',
        '• Personalizar su experiencia de compra y mostrar productos relevantes.',
        '• Mejorar nuestro sitio web, productos y servicios basándonos en sus preferencias.',
        '• Enviar notificaciones sobre promociones, ofertas especiales y novedades (solo si ha dado su consentimiento).',
        '• Detectar, prevenir y resolver problemas técnicos o de seguridad.',
        '• Cumplir con obligaciones legales y regulatorias.'
      ]
    },
    {
      id: 'data-sharing',
      title: 'Compartir Información con Terceros',
      icon: Share2,
      color: 'purple',
      content: [
        'No vendemos ni alquilamos su información personal a terceros. Solo compartimos su información en las siguientes circunstancias:',
        '• Proveedores de Servicios: Compartimos información con proveedores de confianza que nos ayudan a operar nuestro negocio (procesadores de pagos, empresas de envío, servicios de hosting).',
        '• Cumplimiento Legal: Podemos divulgar información cuando sea necesario para cumplir con la ley, regulaciones o procesos legales.',
        '• Protección de Derechos: Para proteger nuestros derechos, propiedad o seguridad, así como los de nuestros usuarios.',
        '• Transferencias Empresariales: En caso de fusión, adquisición o venta de activos, su información puede ser transferida.',
        'Todos nuestros socios están obligados contractualmente a proteger su información y solo pueden usarla para los fines específicos autorizados.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies y Tecnologías de Seguimiento',
      icon: Cookie,
      color: 'amber',
      content: [
        'Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio:',
        '• Cookies Esenciales: Necesarias para el funcionamiento básico del sitio (carrito de compras, sesión de usuario).',
        '• Cookies de Rendimiento: Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio.',
        '• Cookies de Funcionalidad: Recuerdan sus preferencias (idioma, región, tema oscuro/claro).',
        '• Cookies de Marketing: Utilizadas para mostrar anuncios relevantes y medir la efectividad de nuestras campañas.',
        'Puede controlar y eliminar cookies a través de la configuración de su navegador. Sin embargo, deshabilitar cookies puede afectar algunas funcionalidades del sitio.'
      ]
    },
    {
      id: 'data-security',
      title: 'Seguridad de Datos',
      icon: Lock,
      color: 'red',
      content: [
        'Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal:',
        '• Encriptación SSL/TLS para todas las transmisiones de datos sensibles.',
        '• Almacenamiento seguro de contraseñas utilizando algoritmos de hash.',
        '• Servidores protegidos con firewalls y sistemas de detección de intrusos.',
        '• Acceso restringido a información personal solo para personal autorizado.',
        '• Auditorías de seguridad regulares y actualizaciones de sistemas.',
        '• Cumplimiento con estándares PCI DSS para el procesamiento de pagos.',
        'Sin embargo, ningún sistema es 100% seguro. Le recomendamos mantener su contraseña segura y notificarnos inmediatamente si sospecha de acceso no autorizado.'
      ]
    },
    {
      id: 'user-rights',
      title: 'Sus Derechos y Opciones',
      icon: UserCheck,
      color: 'teal',
      content: [
        'Usted tiene los siguientes derechos sobre su información personal:',
        '• Derecho de Acceso: Puede solicitar una copia de la información personal que tenemos sobre usted.',
        '• Derecho de Rectificación: Puede actualizar o corregir información inexacta desde su cuenta.',
        '• Derecho de Eliminación: Puede solicitar la eliminación de su cuenta y datos personales.',
        '• Derecho de Portabilidad: Puede solicitar recibir sus datos en un formato estructurado y de uso común.',
        '• Derecho de Oposición: Puede oponerse al procesamiento de sus datos para marketing directo.',
        '• Derecho de Restricción: Puede solicitar que limitemos el procesamiento de sus datos en ciertas circunstancias.',
        'Para ejercer estos derechos, contacte nuestro equipo de privacidad en privacidad@store.com.gt.'
      ]
    },
    {
      id: 'data-retention',
      title: 'Retención de Datos',
      icon: Calendar,
      color: 'indigo',
      content: [
        'Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos descritos en esta política:',
        '• Información de cuenta activa se retiene mientras su cuenta esté activa.',
        '• Historial de pedidos se conserva durante 5 años para cumplir con obligaciones fiscales y legales.',
        '• Información de marketing se retiene hasta que retire su consentimiento.',
        '• Cookies y datos de sesión se eliminan según las configuraciones establecidas.',
        'Después de estos períodos, eliminamos o anonimizamos su información de manera segura.'
      ]
    },
    {
      id: 'minors',
      title: 'Privacidad de Menores',
      icon: Users,
      color: 'rose',
      content: [
        'Nuestros servicios no están dirigidos a menores de 18 años.',
        'No recopilamos intencionalmente información personal de menores de edad.',
        'Si descubrimos que hemos recopilado información de un menor sin el consentimiento parental apropiado, tomaremos medidas para eliminar esa información.',
        'Si usted es padre o tutor y cree que su hijo nos ha proporcionado información personal, contáctenos inmediatamente.'
      ]
    },
    {
      id: 'international',
      title: 'Transferencias Internacionales',
      icon: Globe,
      color: 'blue',
      content: [
        'Sus datos pueden ser transferidos y procesados en servidores ubicados fuera de Guatemala.',
        'Cuando transferimos datos internacionalmente, nos aseguramos de que existan garantías adecuadas de protección.',
        'Cumplimos con las leyes de protección de datos aplicables en todas las jurisdicciones donde operamos.',
        'Al utilizar nuestros servicios, usted consiente estas transferencias bajo las protecciones descritas en esta política.'
      ]
    },
    {
      id: 'updates',
      title: 'Actualizaciones de esta Política',
      icon: Bell,
      color: 'purple',
      content: [
        'Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas o por razones legales.',
        'Cuando realicemos cambios significativos, le notificaremos por correo electrónico o mediante un aviso destacado en nuestro sitio.',
        'La fecha de "Última actualización" al principio de esta política indica cuándo fue modificada por última vez.',
        'Le recomendamos revisar esta política regularmente para mantenerse informado sobre cómo protegemos su información.'
      ]
    },
    {
      id: 'contact-privacy',
      title: 'Contacto para Asuntos de Privacidad',
      icon: Mail,
      color: 'emerald',
      content: [
        'Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de sus datos personales, puede contactarnos:',
        '• Email de Privacidad: privacidad@store.com.gt',
        '• Email General: soporte@store.com.gt',
        '• Teléfono: +502 2345-6789',
        '• Dirección: Ciudad de Guatemala, Guatemala',
        'Nos comprometemos a responder todas las consultas de privacidad dentro de 15 días hábiles.'
      ]
    }
  ];

  const principles = [
    {
      icon: Lock,
      title: 'Seguridad',
      description: 'Protegemos sus datos con las mejores prácticas de la industria',
      color: 'indigo'
    },
    {
      icon: Eye,
      title: 'Transparencia',
      description: 'Somos claros sobre cómo usamos su información',
      color: 'blue'
    },
    {
      icon: UserCheck,
      title: 'Control',
      description: 'Usted tiene control total sobre sus datos personales',
      color: 'emerald'
    },
    {
      icon: Settings,
      title: 'Cumplimiento',
      description: 'Cumplimos con todas las leyes de protección de datos',
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-200 dark:border-indigo-800',
        hover: 'hover:border-indigo-300 dark:hover:border-indigo-700'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        hover: 'hover:border-blue-300 dark:hover:border-blue-700'
      },
      emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        hover: 'hover:border-emerald-300 dark:hover:border-emerald-700'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        hover: 'hover:border-purple-300 dark:hover:border-purple-700'
      },
      amber: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        hover: 'hover:border-amber-300 dark:hover:border-amber-700'
      },
      teal: {
        bg: 'bg-teal-100 dark:bg-teal-900/30',
        icon: 'text-teal-600 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        hover: 'hover:border-teal-300 dark:hover:border-teal-700'
      },
      rose: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        icon: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        hover: 'hover:border-rose-300 dark:hover:border-rose-700'
      },
      red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        hover: 'hover:border-red-300 dark:hover:border-red-700'
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
              <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Su privacidad es importante para nosotros. Esta política explica cómo recopilamos, 
              usamos y protegemos su información personal.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Última actualización: 20 de octubre de 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Nuestros Principios de Privacidad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((principle) => {
              const Icon = principle.icon;
              const colors = getColorClasses(principle.color);
              
              return (
                <div
                  key={principle.title}
                  className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-200`}
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
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

        {/* Important Notice */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                Compromiso de Privacidad
              </h3>
              <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed text-sm sm:text-base">
                Store se compromete a proteger su privacidad y a cumplir con todas las leyes aplicables de 
                protección de datos en Guatemala. Implementamos medidas de seguridad técnicas y organizativas 
                apropiadas para proteger su información personal contra acceso no autorizado, alteración, 
                divulgación o destrucción.
              </p>
            </div>
          </div>
        </div>

        {/* GDPR Notice (if applicable) */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Cumplimiento Internacional
              </h3>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-sm sm:text-base">
                Aunque estamos basados en Guatemala, respetamos los derechos de privacidad de usuarios 
                internacionales. Si usted es residente de la Unión Europea, tiene derechos adicionales 
                bajo el GDPR (Reglamento General de Protección de Datos). Contáctenos para más información 
                sobre sus derechos específicos.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ¿Preguntas sobre su privacidad?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Nuestro equipo de privacidad está disponible para responder cualquier pregunta sobre 
            cómo manejamos su información personal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:privacidad@store.com.gt"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <Mail className="h-5 w-5" />
              Contactar Privacidad
            </a>
            <a
              href="/profile/settings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              <Settings className="h-5 w-5" />
              Gestionar Configuración
            </a>
          </div>
        </div>

        {/* Data Rights Summary */}
        <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200 mb-3">
                Resumen de sus Derechos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Acceder a sus datos personales
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Corregir información inexacta
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Solicitar eliminación de datos
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Oponerse al marketing directo
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Portabilidad de datos
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-teal-800 dark:text-teal-300">
                    Restringir procesamiento
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}