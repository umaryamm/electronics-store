import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loadProducts, formatPrice } from '../data/catalog';
import { saveAddress } from '../api/addressService';
import { checkout } from '../api/checkoutService';

// Only two payment methods actually exist server-side — no gateway is wired up
// for card/wallet, so offering them would 400 at the createOrder step.
const PAY_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', backendValue: 'COD' },
  { id: 'bank', label: 'Bank Transfer', desc: 'Pay directly to our bank account', backendValue: 'Bank Transfer' },
];

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth(); // email comes from the authenticated user, not re-collected
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState('cod');
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Controlled form fields — matches Address model exactly (fullName, street, city, phone).
  // No postalCode/email: Address has no such columns, so collecting them here was dead weight.
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
  });

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Step 1: save the shipping address — response shape is confirmed as { message, address }
      const addressRes = await saveAddress({
        type: 'shipping',
        fullName: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
      });

      const shippingAddressId = addressRes.address.id;

      // Step 2: push local cart to backend cart, then create the order
      const selectedPayment = PAY_OPTIONS.find((p) => p.id === payment);
      const { order } = await checkout(cart, {
        shippingAddressId,
        shippingMethod: 'Standard Delivery',
        shippingCost: shipping,
        paymentMethod: selectedPayment.backendValue,
      });

      clearCart();
      setPlaced(true);
      // If you'd rather land straight on order tracking instead of the "placed" screen:
      // navigate(`/orders/${order.id}`);
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(
        err.response?.data?.message || 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: '10px' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-sub)', marginBottom: '24px' }}>
          Thanks for shopping with Vision Giants{user?.email ? ` — a confirmation will be sent to ${user.email}` : ''}.
        </p>
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
            <div className="field">
              <label>Full Name</label>
              <input required placeholder="Ali Raza" value={form.fullName} onChange={updateField('fullName')} />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input required placeholder="03xx-xxxxxxx" value={form.phone} onChange={updateField('phone')} />
            </div>
          </div>
          <div className="field">
            <label>Street Address</label>
            <input required placeholder="House #, Street, Area" value={form.street} onChange={updateField('street')} />
          </div>
          <div className="field">
            <label>City</label>
            <input required placeholder="Multan" value={form.city} onChange={updateField('city')} />
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

          {error && (
            <p style={{ color: '#c0392b', marginTop: '14px', fontSize: '0.85rem' }}>{error}</p>
          )}
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
          <button
            className="btn-primary"
            type="submit"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}