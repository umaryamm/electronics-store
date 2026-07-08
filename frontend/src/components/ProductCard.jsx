import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog';
import { useCart } from '../context/CartContext';
import { useQuickView } from '../context/QuickViewContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { openProductQuickView } = useQuickView();

  const rating = product.averageRating || 0;
  const entireStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');
  const outOfStock = (product.stock ?? 0) <= 0;

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-img">
        <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {outOfStock && (
          <span className="badge-new" style={{ background: '#c0392b' }}>Out of Stock</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-cat">{product.category?.name}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-rating">
          {product.reviewCount > 0 ? (
            <>
              {stars} <span>({rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews)</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <button
            className="btn-cart"
            disabled={outOfStock}
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
            disabled={outOfStock}
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