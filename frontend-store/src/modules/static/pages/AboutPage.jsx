import {
  Award,
  CheckCircle,
  Clock,
  Globe,
  Handshake,
  Heart,
  Leaf,
  Package,
  Shield,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    {
      value: '5+',
      label: 'Años de Experiencia',
      icon: Clock,
      color: 'indigo'
    },
    {
      value: '10K+',
      label: 'Clientes Satisfechos',
      icon: Users,
      color: 'blue'
    },
    {
      value: '50K+',
      label: 'Productos Vendidos',
      icon: Package,
      color: 'emerald'
    },
    {
      value: '98%',
      label: 'Satisfacción',
      icon: Star,
      color: 'amber'
    }
  ];

  const values = [
    {
      title: 'Calidad Garantizada',
      description: 'Seleccionamos cuidadosamente cada producto para garantizar la mejor calidad para nuestros clientes.',
      icon: Award,
      color: 'indigo'
    },
    {
      title: 'Atención al Cliente',
      description: 'Nuestro equipo está disponible para ayudarte en cada paso de tu experiencia de compra.',
      icon: Heart,
      color: 'rose'
    },
    {
      title: 'Envío Rápido',
      description: 'Procesamos y enviamos tu pedido lo más rápido posible para que lo recibas a tiempo.',
      icon: Zap,
      color: 'purple'
    },
    {
      title: 'Compra Segura',
      description: 'Protegemos tus datos con la mejor tecnología de seguridad y encriptación.',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Precios Justos',
      description: 'Ofrecemos productos de calidad a precios competitivos y accesibles para todos.',
      icon: Target,
      color: 'emerald'
    },
    {
      title: 'Sostenibilidad',
      description: 'Comprometidos con prácticas responsables y el cuidado del medio ambiente.',
      icon: Leaf,
      color: 'teal'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Fundación',
      description: 'Store nace con la visión de revolucionar el comercio electrónico en Guatemala.',
      icon: Sparkles,
      color: 'indigo'
    },
    {
      year: '2021',
      title: 'Expansión',
      description: 'Alcanzamos cobertura nacional y sumamos más de 1,000 productos a nuestro catálogo.',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      year: '2023',
      title: 'Reconocimiento',
      description: 'Premiados como uno de los mejores ecommerce de Guatemala por nuestra innovación.',
      icon: Award,
      color: 'amber'
    },
    {
      year: '2025',
      title: 'Liderazgo',
      description: 'Más de 10,000 clientes confían en nosotros y continuamos creciendo cada día.',
      icon: Globe,
      color: 'emerald'
    }
  ];

  const team = [
    {
      role: 'Equipo de Ventas',
      description: 'Expertos en productos que te ayudan a encontrar exactamente lo que necesitas.',
      icon: Users,
      color: 'indigo'
    },
    {
      role: 'Servicio al Cliente',
      description: 'Disponibles para resolver tus dudas y brindarte la mejor atención.',
      icon: Heart,
      color: 'rose'
    },
    {
      role: 'Logística',
      description: 'Aseguramos que tu pedido llegue en perfectas condiciones y a tiempo.',
      icon: Truck,
      color: 'blue'
    },
    {
      role: 'Tecnología',
      description: 'Desarrollamos y mejoramos continuamente nuestra plataforma para ti.',
      icon: Zap,
      color: 'purple'
    }
  ];

  const commitments = [
    {
      text: 'Productos 100% originales y verificados',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      text: 'Garantía de satisfacción del cliente',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      text: 'Envío gratis en compras mayores a Q 300',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      text: 'Devoluciones fáciles dentro de 30 días',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      text: 'Atención al cliente 6 días a la semana',
      icon: CheckCircle,
      color: 'emerald'
    },
    {
      text: 'Pagos seguros y protegidos',
      icon: CheckCircle,
      color: 'emerald'
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
      rose: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        icon: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        text: 'text-rose-600 dark:text-rose-400'
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6">
              <Store className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Acerca de Store
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Somos una empresa guatemalteca comprometida con ofrecer la mejor experiencia de compra en línea. 
              Desde 2020, hemos ayudado a miles de clientes a encontrar los productos que necesitan con 
              calidad garantizada y el mejor servicio.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div className={`text-3xl font-bold ${colors.text} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuestra Misión
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Brindar una experiencia de compra en línea excepcional, ofreciendo productos de calidad, 
              precios justos y un servicio al cliente inigualable. Nos esforzamos por ser la primera 
              opción de compra en línea en Guatemala, facilitando el acceso a productos que mejoren 
              la vida de nuestros clientes.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuestra Visión
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Ser el ecommerce líder en Guatemala, reconocido por nuestra innovación, confiabilidad y 
              compromiso con la satisfacción del cliente. Aspiramos a expandir nuestro alcance, ofreciendo 
              cada vez más productos y servicios que hagan la vida de nuestros clientes más fácil y placentera.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Nuestros Valores
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Los principios que guían todo lo que hacemos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colors = getColorClasses(value.color);
              
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-7 w-7 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline/Milestones */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Nuestra Historia
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Los hitos más importantes en nuestro crecimiento
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const colors = getColorClasses(milestone.color);
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center gap-8`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
                        <div className={`inline-block px-3 py-1 ${colors.bg} rounded-full mb-3`}>
                          <span className={`text-sm font-bold ${colors.text}`}>
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Icon Circle */}
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center border-4 border-white dark:border-gray-950 shadow-lg z-10`}>
                      <Icon className={`h-7 w-7 ${colors.icon}`} />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Nuestro Equipo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Profesionales dedicados a brindarte la mejor experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const Icon = member.icon;
              const colors = getColorClasses(member.color);
              
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center hover:shadow-lg transition-all duration-200 group"
                >
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {member.role}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitments */}
        <div className="mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <Handshake className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nuestro Compromiso Contigo
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commitments.map((commitment, index) => {
                const Icon = commitment.icon;
                const colors = getColorClasses(commitment.color);
                
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <Icon className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {commitment.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6">
            <Heart className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Gracias por Confiar en Nosotros
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Tu satisfacción es nuestra prioridad. Seguiremos trabajando cada día para ofrecerte 
            la mejor experiencia de compra en línea en Guatemala.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            >
              <Package className="h-5 w-5" />
              Ver Productos
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}