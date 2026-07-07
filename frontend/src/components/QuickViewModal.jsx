import { useNavigate } from 'react-router-dom';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/catalog';

export default function QuickViewModal() {
  const { item, close } = useQuickView();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!item) return null;
  const { type, data } = item;

  const entireStars = Math.floor(data.rating || 0);
  const hasHalfStar = (data.rating || 0) % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');

  return (
    <div className={`modal-overlay${item ? ' open' : ''}`} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="modal-box">
        <button className="modal-close" onClick={close}>✕</button>
        <div className="qv-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
          {data.emoji}
          {data.badge && (
            <span className={data.badge.includes('%') ? 'badge-sale' : 'badge-new'}>{data.badge}</span>
          )}
        </div>
        <div className="qv-info">
          <div className="qv-cat">{data.category}</div>
          <div className="qv-name">{data.name}</div>
          <div className="qv-rating">
            {data.rating ? (
              <>{stars} <span>({data.rating} · {(data.reviews || 0).toLocaleString()} reviews)</span></>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>

          {type === 'product' ? (
            <>
              <div className="qv-price">
                {data.originalPrice && <span className="old">{formatPrice(data.originalPrice)}</span>}
                {formatPrice(data.price)}
              </div>
              <p className="qv-desc">{data.description}</p>
              <div className="qv-actions">
                <button
                  className="btn-primary"
                  style={{ padding: '11px 22px' }}
                  onClick={() => {
                    addToCart(data.id, 1);
                    close();
                    navigate('/cart');
                  }}
                >
                  Buy Now
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: '10px 20px' }}
                  onClick={() => addToCart(data.id, 1)}
                >
                  🛒 Add to Cart
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: '10px 20px' }}
                  onClick={() => {
                    close();
                    navigate(`/product/${data.id}`);
                  }}
                >
                  Full Details →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="qv-price">{data.difficulty} · {data.duration}</div>
              <p className="qv-desc">{data.description}</p>
              {data.components?.length > 0 && (
                <p className="qv-desc" style={{ marginTop: '-4px' }}>
                  <strong style={{ color: 'var(--text)' }}>Key Components:</strong> {data.components.join(', ')}
                </p>
              )}
              <div className="qv-actions">
                <a
                  className="btn-primary"
                  style={{ padding: '11px 22px' }}
                  href="/contact"
                  onClick={close}
                >
                  Request Source Code
                </a>
                <button className="btn-ghost" style={{ padding: '10px 20px' }} onClick={close}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
