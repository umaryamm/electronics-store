import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { loadProducts, formatPrice } from '../data/catalog';

const PAY_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, UnionPay' },
  { id: 'wallet', label: 'EasyPaisa / JazzCash', desc: 'Pay via mobile wallet' },
];

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState('cod');
  const [placed, setPlaced] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '10px' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>Thanks for shopping with Vision Giants — a confirmation has been sent to your email.</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  if (lines.length === 0 && products.length > 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ marginBottom: '16px' }}>Your cart is empty — nothing to check out yet.</p>
        <button className="btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header" style={{ textAlign: 'left', padding: '40px 0 24px' }}>
        <h1 style={{ textAlign: 'left' }}>Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="cart-layout">
        <div className="form-card">
          <h3 style={{ marginBottom: '18px' }}>Shipping Details</h3>
          <div className="form-grid">
            <div className="field"><label>Full Name</label><input required placeholder="Ali Raza" /></div>
            <div className="field"><label>Phone Number</label><input required placeholder="03xx-xxxxxxx" /></div>
          </div>
          <div className="field"><label>Email</label><input type="email" required placeholder="you@example.com" /></div>
          <div className="field"><label>Street Address</label><input required placeholder="House #, Street, Area" /></div>
          <div className="form-grid">
            <div className="field"><label>City</label><input required placeholder="Multan" /></div>
            <div className="field"><label>Postal Code</label><input placeholder="60000" /></div>
          </div>

          <h3 style={{ margin: '24px 0 14px' }}>Payment Method</h3>
          {PAY_OPTIONS.map((opt) => (
            <label key={opt.id} className={`pay-option${payment === opt.id ? ' selected' : ''}`}>
              <input type="radio" name="payment" checked={payment === opt.id} onChange={() => setPayment(opt.id)} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="summary-box">
          <h3>Order Summary</h3>
          {lines.map(({ product, qty }) => (
            <div className="summary-row" key={product.id}>
              <span>{product.name} × {qty}</span>
              <span>{formatPrice(product.price * qty)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div>
          <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
