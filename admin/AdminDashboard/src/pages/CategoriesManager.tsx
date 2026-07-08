// src/pages/CategoriesManager.tsx
import React, { useState } from 'react';
import productsData from '../products.json';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const CategoriesManager: React.FC = () => {
  // Read core layout structures from our central data resource
  const [categories, setCategories] = useState<Category[]>(() => productsData.categories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📦');

  // Helper calculation function to count products per category tag matching key handles
  const getProductCountForCategory = (categoryId: string): number => {
    if (!productsData.products) return 0;
    return productsData.products.filter((prod: any) => prod.categoryId === categoryId).length;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Please enter a valid category name.');
      return;
    }

    const generatedId = newCatName.trim().toLowerCase().replace(/\s+/g, '-');

    if (categories.some(cat => cat.id === generatedId)) {
      alert('A category with this name already exists.');
      return;
    }

    const targetItem: Category = {
      id: generatedId,
      name: newCatName.trim(),
      emoji: newCatEmoji
    };

    setCategories(prev => [...prev, targetItem]);
    setNewCatName('');
    setNewCatEmoji('📦');
    alert('Category added successfully!');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the "${name}" category?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      alert('Category deleted!');
    }
  };

  return (
    <div>
      {/* Page Heading Area */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Category Management</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Configure structural layout values, establish indexing labels, and modify stock directories.</p>
      </div>

      {/* 🔝 TOP SECTION: Create New Category Form (Stretches across the top width) */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', color: '#0f172a', fontWeight: '600' }}>✨ Create New Category</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '240px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Category Icon / Emoji</label>
            <select 
              value={newCatEmoji} 
              onChange={(e) => setNewCatEmoji(e.target.value)}
              style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '1rem', cursor: 'pointer', height: '42px', boxSizing: 'border-box' }}
            >
              <option value="📦">📦 General Goods</option>
              <option value="📱">📱 Smart Devices</option>
              <option value="💻">💻 Laptops & Computers</option>
              <option value="🎧">🎧 Audio & Sound</option>
              <option value="📷">📷 Cameras</option>
              <option value="🎮">🎮 Gaming Accessories</option>
              <option value="⌚">⌚ Wearables</option>
              <option value="📁">📁 Office Supplies</option>
              <option value="🏠">🏠 Smart Home</option>
              <option value="🛠️">🛠️ Hardware Tools</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, minWidth: '240px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Category Name</label>
            <input
              type="text"
              placeholder="e.g. Office Stationery"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', height: '42px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ padding: '0rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', height: '42px', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            🚀 Save New Category
          </button>
        </form>
      </div>

      {/* 📊 DYNAMIC TOTAL NUMBERS BADGE AREA */}
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
        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
      </div>

      {/* Bottom Section: Existing Categories Table Layout */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '80px' }}>Icon</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Category Display Name</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>System Tag ID</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Linked Products</th> {/* ✨ New Column */}
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const itemsCount = getProductCountForCategory(cat.id);
              return (
                <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', fontSize: '1.5rem' }}>{cat.emoji}</td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>{cat.name}</td>
                  <td style={{ padding: '1rem', color: '#64748b', fontFamily: 'monospace' }}>{cat.id}</td>
                  
                  {/* Dynamic Product Allocation Count Metric */}
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.625rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      backgroundColor: itemsCount > 0 ? '#e0f2fe' : '#f1f5f9', 
                      color: itemsCount > 0 ? '#0369a1' : '#64748b' 
                    }}>
                      {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                    </span>
                  </td>

                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                      title="Delete Category"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};