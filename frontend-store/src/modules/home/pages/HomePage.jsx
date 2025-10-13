import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../../../components/ui';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Truck, 
  Shield, 
  Users,
  Zap,
  Award,
  HeadphonesIcon
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a tu 
              <span className="block text-yellow-300 dark:text-yellow-200">Tienda Online</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-50">
              Descubre productos increíbles con la mejor calidad y precio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-primary-700 dark:hover:bg-white"
                asChild
              >
                <Link to="/catalog">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Explorar Catálogo
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600 dark:border-gray-200 dark:hover:bg-gray-200"
                asChild
              >
                <Link to="/categories">
                  Ver Categorías
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ofrecemos la mejor experiencia de compra online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Envío Rápido</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Entrega gratis en pedidos superiores a $50. Envío express disponible.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Compra Segura</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Pagos protegidos con SSL. Tu información está completamente segura.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Soporte 24/7</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nuestro equipo está disponible para ayudarte cuando lo necesites.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Categorías Populares
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explora nuestras categorías más vendidas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electrónicos', image: '📱', count: '120+ productos', color: 'from-blue-500 to-purple-600' },
              { name: 'Ropa', image: '👕', count: '85+ productos', color: 'from-pink-500 to-rose-600' },
              { name: 'Hogar', image: '🏠', count: '95+ productos', color: 'from-green-500 to-emerald-600' },
              { name: 'Deportes', image: '⚽', count: '60+ productos', color: 'from-orange-500 to-red-600' }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {category.image}
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" asChild>
              <Link to="/categories">
                Ver Todas las Categorías
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-primary-100 dark:border-primary-800">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Listo para comenzar a comprar?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Únete a miles de clientes satisfechos y descubre nuestra increíble selección de productos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white" asChild>
                <Link to="/register">
                  <Award className="h-5 w-5 mr-2" />
                  Crear Cuenta Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/20" asChild>
                <Link to="/catalog">
                  Explorar Productos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}