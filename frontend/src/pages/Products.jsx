import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadProducts } from '../data/catalog';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], categories: [] });
  const [sort, setSort] = useState('featured');
  const activeCategory = params.get('category') || '';
  const query = params.get('q') || '';

  useEffect(() => {
    loadProducts().then(setData);
  }, []);

  const filtered = useMemo(() => {
    let list = data.products;
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    list = [...list];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [data, activeCategory, query, sort]);

  return (
    <div className="container">
      <div className="page-header">
        <h1>Shop All Products</h1>
        <p>Browse our full catalog of electronics, components, and maker gear.</p>
      </div>

      <div className="shop-layout" style={{ paddingBottom: '80px' }}>
        <aside className="sidebar">
          <h4>Categories</h4>
          <div
            className={`sidebar-cat${!activeCategory ? ' active' : ''}`}
            onClick={() => setParams(query ? { q: query } : {})}
          >
            <span>All Products</span>
            <span className="count">{data.products.length}</span>
          </div>
          {data.categories.map((cat) => (
            <div
              key={cat.id}
              className={`sidebar-cat${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setParams(query ? { category: cat.id, q: query } : { category: cat.id })}
            >
              <span>{cat.emoji} {cat.name}</span>
              <span className="count">{cat.count}</span>
            </div>
          ))}
        </aside>

        <div>
          <div className="toolbar">
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-mid)' }}>{filtered.length} products found</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">No products match your filters.</div>
          ) : (
            <div className="product-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
