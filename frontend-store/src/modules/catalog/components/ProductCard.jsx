import { useNavigate } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useCart } from '@/modules/cart/hooks/useCart'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const handleCardClick = () => {
        navigate(`/products/${product.product_id}`)
    }

    const handleAddToCart = (e) => {
        e.stopPropagation()

        addToCart(
            {
                id: product.product_id,
                name: product.name,
                price: Number(product.price),
                image: product.image_path
            },
            1
        )
        toast.success(`"${product.name}" agregado al carrito`)
    }

    return (
        <div
            className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition group cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img
                    src={product.image_path || '/images/products/default.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <button
                    onClick={handleAddToCart}
                    title="Agregar al carrito"
                    className="absolute top-2 right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700
                     transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Agregar al carrito"
                >
                    <FaShoppingCart size={20} />
                </button>
            </div>

            <div className="p-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{product?.category?.name}</p>
                <p className="font-bold text-indigo-600">${Number(product.price).toFixed(2)}</p>
            </div>
        </div>
    )
}
