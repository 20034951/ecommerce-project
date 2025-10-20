// src/modules/cart/hooks/useCart.js
import { useCartContext } from '../context/CartContext.jsx';

export function useCart() {
  return useCartContext();
}
