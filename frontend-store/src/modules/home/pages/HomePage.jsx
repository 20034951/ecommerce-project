import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../../../components/ui';
import { ShoppingBag, ArrowRight, Star, Truck, Shield, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a tu 
              <span className="block text-yellow-300">Tienda Online</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Descubre productos increíbles con la mejor calidad y precio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
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
                className="border-white text-white hover:bg-white hover:text-primary-600"
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600">
              Ofrecemos la mejor experiencia de compra online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
                <p className="text-gray-600">
                  Entrega gratis en pedidos superiores a $50. Envío express disponible.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Compra Segura</h3>
                <p className="text-gray-600">
                  Pagos protegidos con SSL. Tu información está completamente segura.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
                <p className="text-gray-600">
                  Nuestro equipo está disponible para ayudarte cuando lo necesites.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categorías Populares
            </h2>
            <p className="text-lg text-gray-600">
              Explora nuestras categorías más vendidas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electrónicos', image: '📱', count: '120+ productos' },
              { name: 'Ropa', image: '👕', count: '85+ productos' },
              { name: 'Hogar', image: '🏠', count: '95+ productos' },
              { name: 'Deportes', image: '⚽', count: '60+ productos' }
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.image}</div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/categories">
                Ver Todas las Categorías
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para comenzar a comprar?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a miles de clientes satisfechos y descubre nuestra increíble selección de productos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                Crear Cuenta Gratis
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/catalog">
                Explorar Productos
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}