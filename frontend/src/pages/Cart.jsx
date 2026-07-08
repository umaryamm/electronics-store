import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../api/productService';
import { formatPrice } from '../data/catalog';

export default function Cart() {
  const { cart, increaseCartQty, decreaseCartQty, removeFromCart } = useCart();
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Fetch each cart item's product by id directly — the backend paginates the
    // full catalog, so we can't rely on a bulk list containing every cart item.
    Promise.all(
      cart.map((item) =>
        getProduct(item.id)
          .then((p) => [item.id, p])
          .catch(() => [item.id, null]) // product may have been deleted since it was added
      )
    ).then((pairs) => {
      setProductMap(Object.fromEntries(pairs));
      setLoading(false);
    });
  }, [cart]);

  const lines = cart
    .map((item) => {
      const product = productMap[item.id];
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const removedCount = cart.length - lines.length;

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal > 0 && subtotal < 25000 ? 350 : 0;
  const total = subtotal + shipping;

  if (loading) return <div className="container" style={{ padding: '80px 0' }} />;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header" style={{ textAlign: 'left', padding: '40px 0 24px' }}>
        <h1 style={{ textAlign: 'left' }}>Your Cart</h1>
      </div>

      {removedCount > 0 && (
        <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '12px' }}>
          {removedCount} item{removedCount > 1 ? 's' : ''} in your cart {removedCount > 1 ? 'are' : 'is'} no longer available and {removedCount > 1 ? 'have' : 'has'} been removed from view.
        </p>
      )}

      {lines.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>🛒 Your cart is empty.</p>
          <Link className="btn-primary" to="/products" style={{ display: 'inline-flex' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {lines.map(({ product, qty }) => {
              const maxedOut = qty >= product.stock;
              return (
                <div className="cart-item" key={product.id}>
                  <div className="cart-item-img">
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className="cart-item-name">{product.name}</div>
                    <div className="cart-item-price">{formatPrice(product.price)}</div>
                  </div>
                  <div className="qty-control">
                    <button onClick={() => decreaseCartQty(product.id)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => increaseCartQty(product.id)} disabled={maxedOut}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(product.id)}>Remove</button>
                </div>
              );
            })}
          </div>

          <div className="summary-box">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div>
            <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}