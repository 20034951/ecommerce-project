import { useAddToCart } from '@/modules/cart/hooks/useCart';

export default function AddToCartButton({ productId, className = '' }) {
    const { mutate, isPending } = useAddToCart()
    return (
        <button
            onClick={() => mutate({ productId, quantity: 1 })}
            disabled={isPending}
            className={
                'w-full rounded-2xl px-4 py-2 border shadow-sm hover:shadow font-medium disabled:opacity-60 ' +
                className
            }
        >
            {isPending ? 'Agregando…' : 'Agregar al carrito'}
        </button>
    )
}
