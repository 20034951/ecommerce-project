import React, { useState, useEffect } from 'react';
import { X, Save, Package, DollarSign, Hash, Barcode, FileText, Image as ImageIcon } from 'lucide-react';
import { Input } from '../../../components/ui/Input.jsx';
import { Label } from '../../../components/ui/Label.jsx';
import { Textarea } from '../../../components/ui/Textarea.jsx';
import { Select } from '../../../components/ui/Select.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { categoriesApi } from '../../../api/categories.js';

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null,
  isLoading = false
}) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    category_id: '',
    image_path: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        sku: product.sku || '',
        category_id: product.category_id || '',
        image_path: product.image_path || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        category_id: '',
        image_path: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data || response || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Selecciona una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const dataToSave = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category_id: parseInt(formData.category_id)
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {product ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {product ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Nombre */}
              <div>
                <Label htmlFor="name" required>
                  <Package className="h-4 w-4 mr-1 inline" />
                  Nombre del Producto
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Laptop Dell Inspiron 15"
                  error={errors.name}
                  disabled={isLoading}
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">
                  <FileText className="h-4 w-4 mr-1 inline" />
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe las características del producto..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categoría */}
                <div>
                  <Label htmlFor="category_id" required>
                    Categoría
                  </Label>
                  <Select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    error={errors.category_id}
                    disabled={isLoading}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* SKU */}
                <div>
                  <Label htmlFor="sku">
                    <Barcode className="h-4 w-4 mr-1 inline" />
                    SKU
                  </Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ej: LAP-DELL-001"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Precio */}
                <div>
                  <Label htmlFor="price" required>
                    <DollarSign className="h-4 w-4 mr-1 inline" />
                    Precio (Q)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    error={errors.price}
                    disabled={isLoading}
                  />
                </div>

                {/* Stock */}
                <div>
                  <Label htmlFor="stock" required>
                    <Hash className="h-4 w-4 mr-1 inline" />
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    error={errors.stock}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* URL de Imagen */}
              <div>
                <Label htmlFor="image_path">
                  <ImageIcon className="h-4 w-4 mr-1 inline" />
                  URL de Imagen
                </Label>
                <Input
                  id="image_path"
                  name="image_path"
                  value={formData.image_path}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isLoading}
                />
                {formData.image_path && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_path} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar Producto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
