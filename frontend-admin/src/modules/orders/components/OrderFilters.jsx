import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select
} from '../../../components/ui';
import { 
  Filter,
  X,
  Search,
  Calendar,
  Banknote,
  Package
} from 'lucide-react';

export function OrderFilters({ filters, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      status: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      search: ''
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Filtros Avanzados</span>
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-white/20 text-white rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Búsqueda - Ocupa 2 columnas en desktop */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Label htmlFor="search" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Buscar</span>
            </Label>
            <Input
              id="search"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="N° pedido, cliente, email..."
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
            />
          </div>

          {/* Estado */}
          <div>
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>Estado</span>
            </Label>
            <Select
              id="status"
              name="status"
              value={localFilters.status}
              onChange={handleChange}
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </Select>
          </div>

          {/* Fecha Desde */}
          <div>
            <Label htmlFor="dateFrom" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Desde</span>
            </Label>
            <Input
              id="dateFrom"
              name="dateFrom"
              type="date"
              value={localFilters.dateFrom}
              onChange={handleChange}
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <Label htmlFor="dateTo" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Hasta</span>
            </Label>
            <Input
              id="dateTo"
              name="dateTo"
              type="date"
              value={localFilters.dateTo}
              onChange={handleChange}
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg"
            />
          </div>

          {/* Monto Mínimo */}
          <div>
            <Label htmlFor="minAmount" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Banknote className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span>Monto Mínimo</span>
            </Label>
            <Input
              id="minAmount"
              name="minAmount"
              type="number"
              step="0.01"
              min="0"
              value={localFilters.minAmount}
              onChange={handleChange}
              placeholder="0.00"
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 rounded-lg"
            />
          </div>

          {/* Monto Máximo */}
          <div>
            <Label htmlFor="maxAmount" className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Banknote className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span>Monto Máximo</span>
            </Label>
            <Input
              id="maxAmount"
              name="maxAmount"
              type="number"
              step="0.01"
              min="0"
              value={localFilters.maxAmount}
              onChange={handleChange}
              placeholder="0.00"
              className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:border-amber-500 dark:focus:border-amber-400 rounded-lg"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 border-2 border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg h-11"
          >
            Limpiar
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg h-11"
          >
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
