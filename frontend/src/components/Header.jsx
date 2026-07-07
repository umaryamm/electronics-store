import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { loadProducts } from '../data/catalog';
import SearchBar from './SearchBar';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts().then(({ categories }) => setCategories(categories));
  }, []);

  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Vision Giants" className="logo-img" />
          <span className="logo-text">Vision<span>Giants</span></span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li>
            <span className="nav-link-btn" style={{ cursor: 'pointer' }}>
              Products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </span>
            <div className="dropdown">
              {categories.map((cat) => (
                <div key={cat.id} className="drop-item" onClick={() => navigate(`/products?category=${cat.id}`)}>
                  <div className="drop-icon">{cat.emoji}</div>
                  <div>
                    <div className="drop-label">{cat.name}</div>
                    <div className="drop-sub">{cat.description || `${cat.count || ''} items`}</div>
                  </div>
                </div>
              ))}
            </div>
          </li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/policies">Policies</Link></li>
        </ul>

        <div className="nav-end">
          <SearchBar />
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link to="/cart" className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cartCount" style={{ display: cartCount > 0 ? 'flex' : 'none' }}>{cartCount}</span>
          </Link>
          <button className="icon-btn mobile-toggle" onClick={() => setMobileOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              ['/', 'Home'],
              ['/products', 'Products'],
              ['/projects', 'Projects'],
              ['/blog', 'Blog'],
              ['/contact', 'Contact'],
              ['/policies', 'Policies'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '10px 6px', color: 'var(--text-sub)' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
