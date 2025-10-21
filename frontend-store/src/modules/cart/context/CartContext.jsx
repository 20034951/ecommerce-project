import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Si luego conectas backend, puedes activar esto con una env
const USE_SERVER_CART = import.meta?.env?.VITE_USE_SERVER_CART === 'true';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        // Inicializar con el valor del localStorage
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error cargando carrito del localStorage:', error);
            return [];
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    // Persistir en localStorage cuando el carrito cambie
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Carrito guardado en localStorage:', cart);
        } catch (error) {
            console.error('Error guardando carrito en localStorage:', error);
        }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);
        setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
    };

    const clearCart = () => setCart([]);

    const getItemQuantity = (productId) =>
        cart.find(i => i.id === productId)?.quantity ?? 0;

    const itemCount = useMemo(
        () => cart.reduce((t, i) => t + i.quantity, 0),
        [cart]
    );

    const totalPrice = useMemo(
        () => cart.reduce((t, i) => t + (Number(i.price) * i.quantity), 0),
        [cart]
    );

    const value = useMemo(() => ({
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        totalPrice,
    }), [cart, isLoading, itemCount, totalPrice]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook de consumo
export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCartContext must be used within <CartProvider>');
    return ctx;
}
