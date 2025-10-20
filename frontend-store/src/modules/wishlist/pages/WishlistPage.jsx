import React from 'react';
import ProfileLayout from '../../../layouts/ProfileLayout.jsx';
import { Card, CardContent } from '../../../components/ui';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  return (
    <ProfileLayout>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-8 sm:p-12">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 dark:bg-rose-900/20 rounded-2xl mb-4 sm:mb-6">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-rose-600 dark:text-rose-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tu lista de deseos está vacía
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Guarda tus productos favoritos para comprarlos más tarde y no perder de vista lo que te gusta
            </p>
            <a 
              href="/catalog" 
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all"
            >
              <span>Explorar Productos</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}