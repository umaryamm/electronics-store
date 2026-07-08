// src/pages/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productsData from '../products.json'; // Direct reference to products (1).json[cite: 1]
import { Product } from '../types';

export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Form Fields State variables matching FLOW 2 validation rules
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rating, setRating] = useState('0');

  // Pre-populate data if in Edit Mode (FLOW 2 Step 3)
  useEffect(() => {
    if (isEditMode && id) {
      const existingProduct = productsData.products.find(p => p.id === id); //[cite: 1]
      if (existingProduct) {
        setName(existingProduct.name); //[cite: 1]
        setDescription(existingProduct.description); //[cite: 1]
        setPrice(existingProduct.price.toString()); //[cite: 1]
        setCategory(existingProduct.categoryId); //[cite: 1]
        setImageUrl(existingProduct.image); // Using internal reference as placeholder image URL[cite: 1]
        setQuantity('25'); // Fallback default inventory stock quantity
        setRating((existingProduct.rating || 0).toString()); //[cite: 1]
      }
    }
  }, [isEditMode, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend Validations as stated in FLOW 2 Step 2
    if (!name.trim() || !description.trim() || !price || !category || !imageUrl || !quantity) {
      alert('Please fill out all required fields.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      alert('Price must be a valid positive number validation.');
      return;
    }

    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      alert('Quantity must be a valid number.');
      return;
    }

    const numericRating = Number(rating);
    if (numericRating < 0 || numericRating > 5) {
      alert('Rating optional value must reside between 0 and 5.');
      return;
    }

    // Backend Simulation Save / Update Execution
    if (isEditMode) {
      alert('Product updated!'); // Flow 2 Step 3 Success Messaging
    } else {
      alert('Product added!'); // Flow 2 Step 2 Success Messaging
    }

    // Redirect to products list page
    navigate('/admin/products');
  };

  return (
    <div style={{ maxWidth: '700px', backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>
        {isEditMode ? '✏️ Edit Product Details' : '➕ Add New Catalog Product'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Product Name */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Product Name *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. ProVision Premium"
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Category Selection Dropdown */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Category Dropdown *</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box', backgroundColor: '#fff' }}
          >
            <option value="">-- Select Category --</option>
            {productsData.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option> //[cite: 1]
            ))}
          </select>
        </div>

        {/* Price & Quantity Flex Block */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Price ($) *</label>
            <input 
              type="text" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="1299"
              style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Quantity *</label>
            <input 
              type="text" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              placeholder="50"
              style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Image URL Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Image Link URL *</label>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="https://example.com/image.jpg"
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Optional Rating Field */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Rating Optional (0-5)</label>
          <input 
            type="number" 
            step="0.1" 
            min="0" 
            max="5"
            value={rating} 
            onChange={(e) => setRating(e.target.value)} 
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Product Description */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Product Description *</label>
          <textarea 
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Provide a comprehensive breakdown of product features..."
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        {/* Interaction Action Buttons Footer */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/admin/products')}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={{ padding: '0.625rem 1.25rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}
          >
            {isEditMode ? 'Save Modifications' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};