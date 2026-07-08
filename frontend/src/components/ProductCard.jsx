import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog';
import { useCart } from '../context/CartContext';

const WHATSAPP_NUMBER = '923000000000'; // ← your real WhatsApp number, no + sign

// Card layout intentionally mirrors the "New Arrivals" card in Home.jsx
// (same square 1:1 image, same paddings, same button row) so every carousel
// card has identical width AND height.
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I want to buy: ${product.name} (${formatPrice(product.price)})`
  )}`;

  const goToProduct = () => navigate(`/product/${product.id}`);
  const imgSrc = product.imageUrl || (typeof product.image === 'string' && product.image.startsWith('http') ? product.image : null);

  return (
    <div className="product-card" onClick={goToProduct}>
      {product.badge && (
        <div
          style={{
            position: 'absolute', top: '10px', left: '10px',
            background: product.badge.includes('%') ? '#EF4444' : 'var(--cyan)',
            color: product.badge.includes('%') ? '#fff' : '#000',
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', zIndex: 1,
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Square image area — identical to New Arrival card */}
      <div
        style={{
          width: '100%', aspectRatio: '1', background: 'var(--bg3)', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
        }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.4rem' }}>{product.emoji || product.image || '📦'}</span>
        )}
      </div>

      <div style={{ padding: '12px 4px 4px' }}>
        <div
          style={{
            fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', cursor: 'pointer',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: '2.4em', lineHeight: 1.2,
          }}
        >
          {product.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--cyan)', fontWeight: 700 }}>
            {product.originalPrice && (
              <span style={{ color: 'var(--gray-mid)', textDecoration: 'line-through', fontWeight: 400, fontSize: '0.78rem', marginRight: '6px' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {formatPrice(product.price)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product.id, 1); }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Add to cart"
            title="Add to cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '9px', fontSize: '0.8rem', justifyContent: 'center' }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
              navigate('/cart');
            }}
          >
            Buy Now
          </button>
          <a
            className="btn-ghost"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, padding: '9px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.74 13.4L3 21l3.7-1.27a8.93 8.93 0 0 0 4.34 1.1h.01a8.94 8.94 0 0 0 8.93-8.93 8.87 8.87 0 0 0-2.38-5.58zM12.05 19.4h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.95.94-2.73-.18-.28A7.42 7.42 0 1 1 19.5 12a7.45 7.45 0 0 1-7.45 7.4z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}