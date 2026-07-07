import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProducts, filterProducts, formatPrice } from '../data/catalog';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const barRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e) {
      if (barRef.current && !barRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const runFilter = async (value) => {
    const q = value.trim();
    if (!q) {
      setOpen(false);
      return;
    }
    const { products } = await loadProducts();
    setMatches(filterProducts(products, q));
    setActiveIndex(-1);
    setOpen(true);
  };

  const goToProduct = (id) => {
    setOpen(false);
    setQuery('');
    navigate(`/product/${id}`);
  };

  const onKeyDown = (e) => {
    if (!open || !matches.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.min(matches.length, 8) - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = matches[activeIndex >= 0 ? activeIndex : 0];
      if (target) goToProduct(target.id);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="search-bar" ref={barRef}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          runFilter(e.target.value);
        }}
        onFocus={() => query.trim() && runFilter(query)}
        onKeyDown={onKeyDown}
      />
      <div className={`search-results${open ? ' open' : ''}`}>
        {matches.length === 0 ? (
          <div className="search-empty">No products match "{query}"</div>
        ) : (
          matches.slice(0, 8).map((p, i) => (
            <div
              key={p.id}
              className={`search-result-item${i === activeIndex ? ' active' : ''}`}
              onClick={() => goToProduct(p.id)}
            >
              <div className="search-result-icon">{p.emoji || p.image || '📦'}</div>
              <div className="search-result-info">
                <div className="search-result-name">{p.name}</div>
                <div className="search-result-meta">{p.category || ''}</div>
              </div>
              <div className="search-result-price">{formatPrice(p.price)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
