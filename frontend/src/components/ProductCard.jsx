import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { openProductQuickView } = useQuickView();

  const entireStars = Math.floor(product.rating || 0);
  const hasHalfStar = (product.rating || 0) % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-img">
        {product.emoji || product.image || '📦'}
        {product.badge && (
          <span className={product.badge.includes('%') ? 'badge-sale' : 'badge-new'}>{product.badge}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-cat">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          {product.rating ? (
            <>
              {stars} <span>({product.rating} · {(product.reviews || 0).toLocaleString()} reviews)</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
        <div className="product-footer">
          <div className="product-price">
            {product.originalPrice && <span className="old">{formatPrice(product.originalPrice)}</span>}
            {formatPrice(product.price)}
          </div>
          <button
            className="btn-cart"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
            }}
          >
            🛒
          </button>
        </div>
        <div className="product-actions">
          <button
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id, 1);
              navigate('/cart');
            }}
          >
            Buy Now
          </button>
          <button
            className="btn-quick-view"
            onClick={(e) => {
              e.stopPropagation();
              openProductQuickView(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
}
