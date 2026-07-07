import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductById, formatPrice, loadProducts } from '../data/catalog';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setQty(1);
    getProductById(id).then((p) => {
      if (!p) {
        setNotFound(true);
        return;
      }
      setProduct(p);
      loadProducts().then(({ products }) => {
        setRelated(products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4));
      });
    });
  }, [id]);

  if (notFound) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Product not found.</p>
          <Link className="btn-primary" to="/products" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  if (!product) return <div className="container" style={{ padding: '80px 0' }} />;

  const entireStars = Math.floor(product.rating || 0);
  const hasHalfStar = (product.rating || 0) % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <Link to={`/products?category=${product.categoryId}`}>{product.category}</Link> / {product.name}
      </div>

      <div className="detail-layout" style={{ marginTop: '20px' }}>
        <div className="detail-img">
          {product.emoji || product.image || '📦'}
          {product.badge && (
            <span className={product.badge.includes('%') ? 'badge-sale' : 'badge-new'} style={{ position: 'absolute', top: 16, left: 16 }}>{product.badge}</span>
          )}
        </div>

        <div>
          <div className="qv-cat">{product.category}</div>
          <div className="detail-name">{product.name}</div>
          <div className="qv-rating">
            {product.rating ? (
              <>{stars} <span>({product.rating} · {(product.reviews || 0).toLocaleString()} reviews)</span></>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>
          <div className="detail-price">
            {product.originalPrice && <span className="old">{formatPrice(product.originalPrice)}</span>}
            {formatPrice(product.price)}
          </div>
          <p style={{ color: 'var(--text-sub)', lineHeight: 1.6, fontSize: '0.95rem' }}>{product.description}</p>

          <div className="qty-select-detail">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                addToCart(product.id, qty);
                navigate('/cart');
              }}
            >
              Buy Now
            </button>
            <button className="btn-ghost" onClick={() => addToCart(product.id, qty)}>🛒 Add to Cart</button>
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <>
              <h3 style={{ fontSize: '1rem', marginTop: '24px', marginBottom: '4px' }}>Specifications</h3>
              <table className="spec-table">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k}><td>{k}</td><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {product.features?.length > 0 && (
            <>
              <h3 style={{ fontSize: '1rem', marginTop: '20px', marginBottom: '4px' }}>Key Features</h3>
              <ul className="feature-list">
                {product.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>You May Also Like</h2></div>
          <div className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
