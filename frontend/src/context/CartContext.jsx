import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as cartService from '../api/cartService';
import { useAuth } from './AuthContext'; // adjust if your hook/export name differs

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth(); // assumes AuthContext exposes `user` (null when logged out)
  const [cart, setCart] = useState({ id: null, items: [], totalItems: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message = '🛒 Item added to cart!') => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ id: null, items: [], totalItems: 0, subtotal: 0 });
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload cart whenever auth state changes (login/logout)
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (id, type = 'product') => {
      if (!user) {
        showToast('Please log in to add items to your cart.');
        return { ok: false, reason: 'unauthenticated' };
      }
      try {
        await cartService.addToCart(id, type);
        await refreshCart();
        showToast(type === 'project' ? '🛒 Project added to cart!' : undefined);
        return { ok: true };
      } catch (err) {
        const message = err?.response?.data?.message || 'Could not add item to cart.';
        showToast(message);
        return { ok: false, reason: message };
      }
    },
    [user, refreshCart, showToast]
  );

  const updateCartItem = useCallback(
    async (itemId, quantity) => {
      try {
        await cartService.updateCartItem(itemId, quantity);
        await refreshCart();
      } catch (err) {
        const message = err?.response?.data?.message || 'Could not update quantity.';
        showToast(message);
      }
    },
    [refreshCart, showToast]
  );

  const increaseCartQty = useCallback(
    (itemId, currentQty, by = 1) => updateCartItem(itemId, currentQty + by),
    [updateCartItem]
  );

  const decreaseCartQty = useCallback(
    (itemId, currentQty, by = 1) => {
      const next = currentQty - by;
      if (next <= 0) return removeFromCart(itemId);
      return updateCartItem(itemId, next);
    },
    [updateCartItem] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      try {
        await cartService.removeCartItem(itemId);
        await refreshCart();
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    },
    [refreshCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      await refreshCart();
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  }, [refreshCart]);

  const cartCount = useMemo(() => cart.totalItems, [cart.totalItems]);

  const value = useMemo(
    () => ({
      cart: cart.items,
      cartId: cart.id,
      subtotal: cart.subtotal,
      cartCount,
      loading,
      toast,
      addToCart,
      updateCartItem,
      increaseCartQty,
      decreaseCartQty,
      removeFromCart,
      clearCart,
      refreshCart,
    }),
    [cart, cartCount, loading, toast, addToCart, updateCartItem, increaseCartQty, decreaseCartQty, removeFromCart, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}