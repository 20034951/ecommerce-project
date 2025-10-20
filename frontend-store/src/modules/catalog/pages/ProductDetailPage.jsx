import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import productsApi from '../../../api/products';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../../cart/hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, addItem } = useCart();

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getById(id);
      setProduct(res);

      if (res.category_id) {
        const relatedRes = await productsApi.getAll({
          category_id: res.category_id,
          limit: 8,
          page: 1,
        });
        const filtered = relatedRes.items.filter(p => p.product_id !== res.product_id);
        setRelated(filtered);
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
      toast.error('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const LOADING = "Cargando producto...";
  const NOT_FOUND = "Producto no encontrado";
  const RELATED = "Productos relacionados";
  const ADD_TO_CART = "Agregar al carrito";

  // 👇 handler real para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;

    // Normalizamos el ítem al mismo shape que usas en CheckoutPage
    const item = {
      id: product.product_id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.image_path || null,
    };

    try {
      if (typeof addToCart === 'function') {
        addToCart(item);
      } else if (typeof addItem === 'function') {
        addItem(item, 1);
      } else {
        throw new Error('El hook useCart no expone addToCart ni addItem');
      }

      toast.success(`"${product.name}" agregado al carrito`);
    } catch (e) {
      console.error(e);
      toast.error('No se pudo agregar al carrito');
    }
  };

  if (loading) return <p className="p-4">{LOADING}</p>;
  if (!product) return <p className="p-4">{NOT_FOUND}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div>
          <img
            src={product.image_path || '/images/products/default.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover rounded" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.category?.name}</p>
          <p className="text-indigo-600 font-bold text-2xl">${product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-max mt-4">
            <FaShoppingCart size={20} />
            <span>{ADD_TO_CART}</span>
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">{RELATED}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.product_id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
