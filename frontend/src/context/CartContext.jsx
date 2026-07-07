import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadProducts } from '../data/catalog';

const CART_STORAGE_KEY = 'visiongiants_cart';
const CartContext = createContext(null);

function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistCart(cart) {
  const valid = cart.filter((item) => item.qty > 0);
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(valid));
  } catch {
    /* private browsing fallback: ignore */
  }
  return valid;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);
  const [toast, setToast] = useState(null);

  // Reconcile against the catalog once on load, same as reconcileCart() in shared.js
  useEffect(() => {
    (async () => {
      const { products } = await loadProducts();
      const validIds = new Set(products.map((p) => p.id));
      setCart((prev) => {
        const cleaned = prev.filter((item) => validIds.has(item.id) && item.qty > 0);
        persistCart(cleaned);
        return cleaned.length === prev.length ? prev : cleaned;
      });
    })();
  }, []);

  const showToast = useCallback((message = '🛒 Item added to cart!') => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const addToCart = useCallback(
    (productId, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === productId);
        const next = existing
          ? prev.map((i) => (i.id === productId ? { ...i, qty: i.qty + qty } : i))
          : [...prev, { id: productId, qty }];
        return persistCart(next);
      });
      showToast();
    },
    [showToast]
  );

  const setCartQty = useCallback((productId, qty) => {
    setCart((prev) => {
      let next;
      if (qty <= 0) {
        next = prev.filter((i) => i.id !== productId);
      } else {
        const existing = prev.find((i) => i.id === productId);
        next = existing
          ? prev.map((i) => (i.id === productId ? { ...i, qty } : i))
          : [...prev, { id: productId, qty }];
      }
      return persistCart(next);
    });
  }, []);

  const increaseCartQty = useCallback((productId, by = 1) => {
    setCart((prev) => persistCart(prev.map((i) => (i.id === productId ? { ...i, qty: i.qty + by } : i))));
  }, []);

  const decreaseCartQty = useCallback((productId, by = 1) => {
    setCart((prev) => {
      const next = prev
        .map((i) => (i.id === productId ? { ...i, qty: i.qty - by } : i))
        .filter((i) => i.qty > 0);
      return persistCart(next);
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => persistCart(prev.filter((i) => i.id !== productId)));
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCart([]);
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      toast,
      addToCart,
      setCartQty,
      increaseCartQty,
      decreaseCartQty,
      removeFromCart,
      clearCart,
    }),
    [cart, cartCount, toast, addToCart, setCartQty, increaseCartQty, decreaseCartQty, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
