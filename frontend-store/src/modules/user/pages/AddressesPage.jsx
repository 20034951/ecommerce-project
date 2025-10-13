import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Button
} from '../../../components/ui';
import { 
  Plus, 
  MapPin, 
  Edit3, 
  Trash2,
  Home,
  Building,
  Star
} from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAddresses = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddresses([
        {
          id: 1,
          type: 'home',
          isDefault: true,
          title: 'Casa',
          name: 'Juan Pérez',
          address: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          zipCode: '1043',
          country: 'Argentina',
          phone: '+54 11 1234-5678'
        },
        {
          id: 2,
          type: 'office',
          isDefault: false,
          title: 'Oficina',
          name: 'Juan Pérez',
          address: 'Av. Santa Fe 5678',
          city: 'Buenos Aires',
          state: 'CABA',
          zipCode: '1425',
          country: 'Argentina',
          phone: '+54 11 8765-4321'
        }
      ]);
      setIsLoading(false);
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    // TODO: Implement add address modal
    console.log('Add address');
  };

  const handleEditAddress = (id) => {
    // TODO: Implement edit address modal
    console.log('Edit address', id);
  };

  const handleDeleteAddress = (id) => {
    // TODO: Implement delete confirmation
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'office':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando direcciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Direcciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus direcciones de envío
          </p>
        </div>
        <Button 
          onClick={handleAddAddress}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dirección
        </Button>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <MapPin className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No tienes direcciones guardadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega una dirección para facilitar tus compras futuras
            </p>
            <Button 
              onClick={handleAddAddress}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
                address.isDefault ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white flex items-center">
                        {address.title}
                        {address.isDefault && (
                          <span className="ml-2 flex items-center text-sm text-primary-600 dark:text-primary-400">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            Principal
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {address.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address.id)}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-900 dark:text-white">
                    {address.address}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Tel: {address.phone}
                    </p>
                  )}
                </div>
                
                {!address.isDefault && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Establecer como principal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mt-8">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Acerca de tus direcciones
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• La dirección principal se usará por defecto en tus pedidos</li>
                <li>• Puedes tener múltiples direcciones guardadas</li>
                <li>• Todas las direcciones están encriptadas y seguras</li>
                <li>• Puedes editar o eliminar direcciones en cualquier momento</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}