import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building2,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      primary: 'soporte@store.com.gt',
      secondary: 'ventas@store.com.gt',
      color: 'indigo',
      link: 'mailto:soporte@store.com.gt'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      primary: '+502 2345-6789',
      secondary: '+502 2345-6790',
      color: 'emerald',
      link: 'tel:+50223456789'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      primary: 'Zona 10, Ciudad de Guatemala',
      secondary: 'Guatemala, Guatemala',
      color: 'blue',
      link: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Horario',
      primary: 'Lun - Vie: 8:00 AM - 6:00 PM',
      secondary: 'Sáb: 9:00 AM - 1:00 PM',
      color: 'purple',
      link: null
    }
  ];

  const departments = [
    {
      name: 'Servicio al Cliente',
      icon: MessageSquare,
      email: 'soporte@store.com.gt',
      description: 'Consultas generales y soporte',
      color: 'indigo'
    },
    {
      name: 'Ventas',
      icon: Building2,
      email: 'ventas@store.com.gt',
      description: 'Cotizaciones y pedidos corporativos',
      color: 'blue'
    },
    {
      name: 'Soporte Técnico',
      icon: AlertCircle,
      email: 'soporte.tecnico@store.com.gt',
      description: 'Ayuda con productos y garantías',
      color: 'purple'
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/store',
      color: 'blue',
      followers: '10K+'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/store',
      color: 'rose',
      followers: '8K+'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/store',
      color: 'sky',
      followers: '5K+'
    }
  ];

  const faqs = [
    {
      question: '¿Cuál es el tiempo de respuesta?',
      answer: 'Respondemos todos los correos dentro de 24-48 horas hábiles.'
    },
    {
      question: '¿Tienen atención telefónica?',
      answer: 'Sí, nuestras líneas están disponibles de lunes a viernes de 8:00 AM a 6:00 PM.'
    },
    {
      question: '¿Puedo visitar su tienda física?',
      answer: 'Actualmente solo operamos en línea, pero pronto abriremos nuestra tienda física.'
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
      rose: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        icon: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        hover: 'hover:border-rose-300 dark:hover:border-rose-700'
      },
      sky: {
        bg: 'bg-sky-100 dark:bg-sky-900/30',
        icon: 'text-sky-600 dark:text-sky-400',
        border: 'border-sky-200 dark:border-sky-800',
        hover: 'hover:border-sky-300 dark:hover:border-sky-700'
      }
    };
    return colors[color] || colors.indigo;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6">
              <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const colors = getColorClasses(info.color);
            const content = (
              <>
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {info.primary}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {info.secondary}
                </p>
              </>
            );

            return info.link ? (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-200 hover:shadow-lg text-center group`}
              >
                {content}
              </a>
            ) : (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-xl border-2 ${colors.border} p-6 text-center`}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Envíanos un Mensaje
                </h2>
              </div>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                        ¡Mensaje enviado con éxito!
                      </p>
                      <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                        Te responderemos dentro de las próximas 24-48 horas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tu nombre"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="+502 1234-5678"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Asunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="general">Consulta General</option>
                      <option value="order">Estado de Pedido</option>
                      <option value="product">Información de Producto</option>
                      <option value="technical">Soporte Técnico</option>
                      <option value="complaint">Queja o Reclamo</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Departments */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Departamentos
              </h3>
              <div className="space-y-3">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  const colors = getColorClasses(dept.color);
                  
                  return (
                    <a
                      key={index}
                      href={`mailto:${dept.email}`}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    >
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {dept.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {dept.description}
                        </p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 group-hover:underline">
                          {dept.email}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Síguenos
              </h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  const colors = getColorClasses(social.color);
                  
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {social.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {social.followers} seguidores
                          </p>
                        </div>
                      </div>
                      <Send className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQs Quick */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Preguntas Rápidas
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {faq.question}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
              <a
                href="/help"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Ver más preguntas
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Tiempo de Respuesta
              </h3>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed text-sm sm:text-base">
                Nos esforzamos por responder todos los mensajes dentro de las 24-48 horas hábiles. 
                Para asuntos urgentes, te recomendamos contactarnos directamente por teléfono durante 
                nuestro horario de atención.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}