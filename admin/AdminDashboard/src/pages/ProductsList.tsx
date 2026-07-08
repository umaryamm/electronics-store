// src/pages/ProductsList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productsData from '../products.json'; 
import { Product } from '../types';

export const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Initial local product list setup
  const [products, setProducts] = useState<Product[]>(() => {
    const rawProducts = productsData.products as any[];
    return rawProducts.map((prod, index) => ({
      ...prod,
      stockQuantity: prod.id === 'giantbookpro14' ? 5 : 25 + index,
      status: index % 4 === 0 ? 'inactive' : 'active'
    }));
  });

  // 🔍 2. Filter States for Search Bar & Category Dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // 🛠️ 3. Smart Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = searchQuery !== '' || 
                            selectedCategory === 'All Categories' || 
                            product.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Delete item handler
  const handleDeleteProduct = (id: string, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (confirmDelete) {
      setProducts(prevProducts => prevProducts.filter(item => item.id !== id));
      alert('Product deleted!');
    }
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Product Catalog</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Review stock metrics, pricing points, and statuses.</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={{ padding: '0.625rem 1.25rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}
        >
          ➕ Add Product
        </button>
      </div>

      {/* 🔍 FILTER BAR SECTION */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* Search Bar Input */}
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
              backgroundColor: '#fff'
            }}
          />
        </div>

        {/* Category Filter Dropdown */}
        <div style={{ width: '220px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
              backgroundColor: '#fff',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <option value="All Categories">📂 All Categories</option>
            {productsData.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📊 DYNAMIC AMOUNT / COUNT BADGE AREA */}
      <div style={{ 
        marginBottom: '1rem', 
        fontSize: '0.925rem', 
        color: '#475569', 
        fontWeight: '600',
        backgroundColor: '#e2e8f0',
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
        display: 'inline-block'
      }}>
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
      </div>

      {/* Main Responsive Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Image</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Product Name</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Category</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Price</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Stock</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontSize: '1.75rem', width: '60px' }}>
                  {product.emoji || '📦'}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{product.name}</div>
                  {product.badge && (
                    <span style={{ display: 'inline-block', padding: '0.125rem 0.375rem', fontSize: '0.75rem', borderRadius: '0.25rem', backgroundColor: product.badge.includes('−') ? '#fee2e2' : '#e0f2fe', color: product.badge.includes('−') ? '#ef4444' : '#0369a1', marginTop: '0.25rem' }}>
                      {product.badge}
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>{product.category}</td>
                <td style={{ padding: '1rem', fontWeight: '500', color: '#0f172a' }}>${product.price}</td>
                <td style={{ padding: '1rem', color: (product.stockQuantity || 0) < 10 ? '#ef4444' : '#0f172a' }}>
                  <span style={{ fontWeight: (product.stockQuantity || 0) < 10 ? '700' : '400' }}>{product.stockQuantity} units</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', fontSize: '0.75rem', borderRadius: '9999px', fontWeight: '600', backgroundColor: product.status === 'active' ? '#dcfce7' : '#f1f5f9', color: product.status === 'active' ? '#15803d' : '#64748b' }}>
                    {product.status === 'active' ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => navigate(`/admin/products/edit/${product.id}`)} style={{ padding: '0.375rem 0.75rem', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', backgroundColor: '#f1f5f9', color: '#1e293b', marginRight: '0.5rem', fontWeight: '500' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id, product.name)} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: '500' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div style={{ textTransform: 'none', textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.95rem' }}>
            No products match your search query or selected category filter.
          </div>
        )}
      </div>
    </div>
  );
};