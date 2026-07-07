import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadProducts, formatPrice } from '../data/catalog';

export default function Cart() {
  const { cart, increaseCartQty, decreaseCartQty, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts().then(({ products }) => setProducts(products));
  }, []);

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal > 0 && subtotal < 25000 ? 350 : 0;
  const total = subtotal + shipping;

  if (products.length === 0) return <div className="container" style={{ padding: '80px 0' }} />;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header" style={{ textAlign: 'left', padding: '40px 0 24px' }}>
        <h1 style={{ textAlign: 'left' }}>Your Cart</h1>
      </div>

      {lines.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>🛒 Your cart is empty.</p>
          <Link className="btn-primary" to="/products" style={{ display: 'inline-flex' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {lines.map(({ product, qty }) => (
              <div className="cart-item" key={product.id}>
                <div className="cart-item-img">{product.emoji || product.image || '📦'}</div>
                <div>
                  <div className="cart-item-name">{product.name}</div>
                  <div className="cart-item-price">{formatPrice(product.price)}</div>
                </div>
                <div className="qty-control">
                  <button onClick={() => decreaseCartQty(product.id)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => increaseCartQty(product.id)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(product.id)}>Remove</button>
              </div>
            ))}
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
