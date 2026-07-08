// src/pages/BlogsManager.tsx
import React, { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  status: 'Published' | 'Draft';
  summary: string;
  imageUrl: string; // ✨ Added image property
}

export const BlogsManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 'POST-001',
      title: 'Top 5 Tech Gadgets Revolutionizing 2026',
      author: 'Admin',
      publishDate: '2026-06-15',
      status: 'Published',
      summary: 'A deep dive into the latest smartphone and AI hardware ecosystem shifts hitting the consumer retail market.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500'
    },
    {
      id: 'POST-002',
      title: 'Our New Fulfillment Center is Officially Live!',
      author: 'Admin',
      publishDate: '2026-06-28',
      status: 'Draft',
      summary: 'Announcing our strategic logistics expansion allowing 2-day domestic courier routing for all electronics.',
      imageUrl: ''
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(''); // ✨ State for image input
  const [newStatus, setNewStatus] = useState<'Published' | 'Draft'>('Draft');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('Please fill out the article title and short summary.');
      return;
    }

    const nextPost: BlogPost = {
      id: `POST-${String(posts.length + 1).padStart(3, '0')}`,
      title: newTitle.trim(),
      author: 'Admin', // Always set to Admin automatically
      publishDate: new Date().toISOString().split('T')[0],
      status: newStatus,
      summary: newSummary.trim(),
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500' // Fallback thumb
    };

    setPosts(prev => [nextPost, ...prev]);
    setNewTitle('');
    setNewSummary('');
    setNewImageUrl('');
    alert('Blog post entry successfully logged!');
  };

  // ✨ Inline status changer function
  const handleStatusChange = (id: string, updatedStatus: 'Published' | 'Draft') => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, status: updatedStatus } : post));
    alert(`Article status updated to ${updatedStatus}`);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm(`Are you sure you want to delete blog article "${id}"?`)) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Blog Articles Manager</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Draft corporate press releases, announce inventory updates, and publish consumer resources.</p>
      </div>

      {/* 🚀 INPUT FORM BLOCK */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', color: '#0f172a', fontWeight: '600' }}>✍️ Compose New Article</h3>
        <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            
            <div style={{ flex: 2, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Article Title</label>
              <input type="text" placeholder="e.g. Introducing the ProVision Max" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', height: '42px', boxSizing: 'border-box' }} />
            </div>

            {/* ✨ Image Link Input Field */}
            <div style={{ flex: 1.5, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Cover Image URL</label>
              <input type="text" placeholder="Paste image address (https://...)" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', height: '42px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Initial Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value as 'Published' | 'Draft')} style={{ padding: '0.625rem 2rem 0.625rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.925rem', cursor: 'pointer', height: '42px', boxSizing: 'border-box' }}>
                <option value="Draft">📝 Save as Draft</option>
                <option value="Published">🚀 Publish Live</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Short Content Summary / Excerpt</label>
            <textarea placeholder="Write a brief overview sentence to catch readers attention..." value={newSummary} onChange={e => setNewSummary(e.target.value)} rows={3} style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ width: 'fit-content', padding: '0 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', height: '42px', transition: 'background 0.2s', alignSelf: 'flex-end' }}>
            💾 Save Article
          </button>
        </form>
      </div>

      {/* Content Table Block */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '100px' }}>Post ID</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '110px' }}>Image</th> {/* ✨ New Column */}
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '320px' }}>Title & Excerpt</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Date Logged</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '160px' }}>Status Toggle</th> {/* ✨ Changed heading */}
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#64748b', fontFamily: 'monospace' }}>{post.id}</td>
                
                {/* ✨ Display Cover Thumbnail Preview */}
                <td style={{ padding: '1rem' }}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt="preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No Img</div>
                  )}
                </td>

                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{post.title}</div>
                  <div style={{ 
                    fontSize: '0.825rem', 
                    color: '#64748b', 
                    marginTop: '0.25rem', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  } as React.CSSProperties}>
                    {post.summary}
                  </div>
                </td>
                
                {/* ❌ Author column has been removed from here */}
                <td style={{ padding: '1rem', color: '#64748b' }}>{post.publishDate}</td>
                
                {/* ✨ Editable Live Status Dropdown inside the Row */}
                <td style={{ padding: '1rem' }}>
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post.id, e.target.value as 'Published' | 'Draft')}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: post.status === 'Published' ? '#dcfce7' : '#f1f5f9',
                      color: post.status === 'Published' ? '#16a34a' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Draft">📝 Draft</option>
                    <option value="Published">🚀 Published</option>
                  </select>
                </td>

                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDeletePost(post.id)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};