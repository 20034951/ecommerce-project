import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderSuccessPage() {
    const { orderNumber } = useParams();
    return (
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra! 🎉</h1>
            <p className="mb-2">Tu número de pedido es:</p>
            <p className="text-2xl font-mono font-semibold text-indigo-700">{orderNumber}</p>
            <div className="mt-8 flex gap-3 justify-center">
                <Link to="/catalog" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Seguir comprando</Link>
                <Link to="/orders" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Ver mis pedidos</Link>
            </div>
        </div>
    );
}
