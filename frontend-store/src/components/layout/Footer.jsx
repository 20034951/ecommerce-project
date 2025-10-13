import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Store</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu tienda online de confianza. Encuentra los mejores productos 
              con la mejor calidad y precio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/catalog" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Catálogo
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Categorías
              </Link>
              <Link 
                to="/about" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Acerca de
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Atención al Cliente</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/help" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Centro de Ayuda
              </Link>
              <Link 
                to="/shipping" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Envíos
              </Link>
              <Link 
                to="/returns" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Devoluciones
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Política de Privacidad
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Términos y Condiciones
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Calle Principal, Ciudad, País
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  contacto@store.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4">Suscríbete a nuestro Newsletter</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Store. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <img 
              src="/images/payment/visa.png" 
              alt="Visa" 
              className="h-6 opacity-60"
            />
            <img 
              src="/images/payment/mastercard.png" 
              alt="Mastercard" 
              className="h-6 opacity-60"
            />
            <img 
              src="/images/payment/paypal.png" 
              alt="PayPal" 
              className="h-6 opacity-60"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}