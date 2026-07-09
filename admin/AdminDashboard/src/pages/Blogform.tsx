// src/pages/BlogForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productsData from '../products.json';
import { BlogPost, LinkedProduct, initialBlogPosts, makeLinkId } from './BlogsManager';

const blankLink = (): LinkedProduct => ({
  id: makeLinkId(),
  productId: '',
  label: '',
  url: ''
});

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box', fontSize: '0.95rem'
};

const linkCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem'
};

export const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<BlogPost['status']>('Draft');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkedProducts, setLinkedProducts] = useState<LinkedProduct[]>([]);

  // Pre-populate data if in Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      // Swap this lookup for a real fetch/store call once the backend is wired up
      const existingPost = initialBlogPosts.find(p => p.id === id);
      if (existingPost) {
        setTitle(existingPost.title);
        setUrl(existingPost.url);
        setStatus(existingPost.status);
        setDescription(existingPost.description);
        setImageUrl(existingPost.imageUrl);
        setLinkedProducts(existingPost.linkedProducts.map(link => ({ ...link })));
      }
    }
  }, [isEditMode, id]);

  const addLink = () => setLinkedProducts(prev => [...prev, blankLink()]);
  const removeLink = (linkId: string) => setLinkedProducts(prev => prev.filter(l => l.id !== linkId));
  const updateLink = (linkId: string, patch: Partial<LinkedProduct>) =>
    setLinkedProducts(prev => prev.map(l => (l.id === linkId ? { ...l, ...patch } : l)));

  // When a user picks a catalog product from the dropdown, auto-fill the label & link
  const handlePickCatalogProduct = (linkId: string, productId: string) => {
    if (!productId) {
      updateLink(linkId, { productId: '' });
      return;
    }
    const product = productsData.products.find((p: any) => p.id === productId);
    if (product) {
      updateLink(linkId, {
        productId,
        label: product.name,
        url: `/products/${product.id}`
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill out the article title and description.');
      return;
    }

    const cleanedLinks = linkedProducts
      .filter(l => l.label.trim() || l.url.trim())
      .map(l => ({ ...l, label: l.label.trim(), url: l.url.trim() }));

    const missingUrl = cleanedLinks.find(l => l.label && !l.url);
    if (missingUrl) {
      alert(`Please add a link URL for "${missingUrl.label}", or remove that entry.`);
      return;
    }

    const payload = {
      title: title.trim(),
      url: url.trim(),
      status,
      description: description.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500',
      author: 'Admin',
      publishDate: isEditMode ? undefined : new Date().toISOString().split('T')[0],
      linkedProducts: cleanedLinks
    };
    console.log('Blog post payload:', payload);

    // Backend simulation save / update
    if (isEditMode) {
      alert('Article updated!');
    } else {
      alert('Article entry logged successfully!');
    }

    navigate('/admin/blogs');
  };

  return (
    <div style={{ maxWidth: '760px', backgroundColor: '#fff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>
        {isEditMode ? '✏️ Edit Blog Article' : '✍️ Compose New Article'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Article Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introducing the ProVision Max" style={inputStyle} />
        </div>

        {/* URL + Status */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '260px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Article URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/blog/introducing-the-provision-max" style={inputStyle} />
          </div>
          <div style={{ width: '180px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as BlogPost['status'])} style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}>
              <option value="Draft">📝 Draft</option>
              <option value="Published">🚀 Published</option>
            </select>
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Cover Image URL</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image address (https://...)" style={inputStyle} />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.375rem', color: '#4b5563' }}>Description *</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write the article summary or full content..." style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
        </div>

        {/* Dynamic linked products */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>
              Linked Products <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>(readers can click through to view these on the site)</span>
            </label>
            <button type="button" onClick={addLink} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.75rem', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Product Link
            </button>
          </div>

          {linkedProducts.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: '0.875rem' }}>No product links added yet. Click "Add Product Link" to let readers click through to a product page.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {linkedProducts.map((link, idx) => (
                <div key={link.id} style={linkCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>Product Link {idx + 1}</span>
                    <button type="button" onClick={() => removeLink(link.id)} title="Remove link" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.375rem' }}>Pick from Catalog (optional)</label>
                    <select
                      value={link.productId || ''}
                      onChange={(e) => handlePickCatalogProduct(link.id, e.target.value)}
                      style={{ ...inputStyle, backgroundColor: '#fff', cursor: 'pointer' }}
                    >
                      <option value="">-- Custom link (no catalog product) --</option>
                      {productsData.products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.375rem' }}>Display Label</label>
                      <input type="text" value={link.label} onChange={(e) => updateLink(link.id, { label: e.target.value, productId: '' })} placeholder="e.g. ProVision X15 Ultra" style={inputStyle} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.375rem' }}>Link URL</label>
                      <input type="text" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value, productId: '' })} placeholder="/products/provisionx15" style={inputStyle} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <button type="button" onClick={() => navigate('/admin/blogs')} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}>
            Cancel
          </button>
          <button type="submit" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '600' }}>
            {isEditMode ? 'Save Modifications' : 'Publish Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};