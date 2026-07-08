// src/pages/ProjectsManager.tsx
import React, { useState } from 'react';

interface Project {
  id: string;
  title: string;
  category: 'Commercial' | 'University';
  completionDate: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  imageUrl: string; // ✨ Added image URL property
}

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'PRJ-001',
      title: 'E-Commerce Marketplace Web App',
      category: 'Commercial',
      completionDate: '2026-05-12',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500'
    },
    {
      id: 'PRJ-002',
      title: 'Automated Room Mapping Drone Software',
      category: 'University',
      completionDate: '2026-06-20',
      status: 'Completed',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500'
    },
    {
      id: 'PRJ-003',
      title: 'Corporate ERP Dashboard Overhaul',
      category: 'Commercial',
      completionDate: '2026-09-01',
      status: 'In Progress',
      imageUrl: ''
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'All' | 'Commercial' | 'University'>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(''); // ✨ State for project image input
  const [newCategory, setNewCategory] = useState<'Commercial' | 'University'>('Commercial');

  // Filter Logic matching the tab selection
  const filteredProjects = projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a project title.');
      return;
    }

    const nextProject: Project = {
      id: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
      title: newTitle.trim(),
      category: newCategory,
      completionDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500' // Fallback thumb
    };

    setProjects(prev => [...prev, nextProject]);
    setNewTitle('');
    setNewImageUrl('');
    alert('Project entry logged successfully!');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm(`Permanently remove project entry "${id}" from files?`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Project Portfolio</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track client deliverables, audit capstone developments, and log production timelines.</p>
      </div>

      {/* 🚀 INPUT FORM BLOCK */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.125rem', color: '#0f172a', fontWeight: '600' }}>✨ Log New Project Entry</h3>
        <form onSubmit={handleAddProject} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          <div style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Project Title</label>
            <input type="text" placeholder="e.g. Flight Booking Portal" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', height: '42px', boxSizing: 'border-box' }} />
          </div>

          {/* ✨ New Image URL Input Field Replacing Client Name */}
          <div style={{ flex: 1.5, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Project Image URL</label>
            <input type="text" placeholder="Paste image address (https://...)" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} style={{ padding: '0.625rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.925rem', height: '42px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ width: '210px', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Classification Group</label>
            <select 
              value={newCategory} 
              onChange={e => setNewCategory(e.target.value as 'Commercial' | 'University')} 
              style={{ 
                padding: '0.625rem 2.25rem 0.625rem 0.75rem',
                borderRadius: '0.375rem', 
                border: '1px solid #cbd5e1', 
                backgroundColor: '#fff', 
                fontSize: '0.95rem', 
                cursor: 'pointer', 
                height: '42px', 
                boxSizing: 'border-box',
                width: '100%'
              }}
            >
              <option value="Commercial">💼 Commercial Project</option>
              <option value="University">🎓 University Project</option>
            </select>
          </div>

          <button type="submit" style={{ padding: '0 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', height: '42px', transition: 'background 0.2s' }}>
            ➕ Add Project
          </button>
        </form>
      </div>

      {/* 📑 INTERACTIVE SUB-CATEGORY FILTER TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        {(['All', 'Commercial', 'University'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '0.5rem 1.25rem',
              border: 'none',
              background: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: activeFilter === tab ? '#3b82f6' : '#64748b',
              borderBottom: activeFilter === tab ? '3px solid #3b82f6' : '3px solid transparent',
              marginBottom: '-11px',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'All' ? '🌐 All Frameworks' : tab === 'Commercial' ? '💼 Commercial Core' : '🎓 University Lab'}
          </button>
        ))}
      </div>

      {/* Dynamic Count Badge */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#475569', fontWeight: '600', backgroundColor: '#e2e8f0', padding: '0.4rem 0.75rem', borderRadius: '0.25rem', display: 'inline-block' }}>
        {filteredProjects.length} {filteredProjects.length === 1 ? 'project entry listed' : 'project entries listed'}
      </div>

      {/* Content Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '120px' }}>Project ID</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '110px' }}>Image</th> {/* ✨ New Column */}
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Project Title Name</th>
              {/* ❌ Client/Course Header Column Removed From Here */}
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '180px' }}>Group Classification</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '150px' }}>Pipeline Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right', width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#64748b', fontFamily: 'monospace' }}>{p.id}</td>
                
                {/* ✨ Display Project Image Preview */}
                <td style={{ padding: '1rem' }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No Img</div>
                  )}
                </td>

                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>{p.title}</td>
                {/* ❌ Client/Course data cell removed from here */}
                
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: p.category === 'Commercial' ? '#e0f2fe' : '#f3e8ff', color: p.category === 'Commercial' ? '#0369a1' : '#6b21a8' }}>
                    {p.category}
                  </span>
                </td>{/* ✨ Live Dropdown Status Toggle inside the Row */}
                <td style={{ padding: '1rem' }}>
                  <select
                    value={p.status}
                    onChange={(e) => {
                      const updatedStatus = e.target.value as Project['status'];
                      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, status: updatedStatus } : item));
                      alert(`Project "${p.id}" status updated to ${updatedStatus}`);
                    }}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: p.status === 'Completed' ? '#dcfce7' : p.status === 'In Progress' ? '#e0f2fe' : '#fee2e2',
                      color: p.status === 'Completed' ? '#16a34a' : p.status === 'In Progress' ? '#0369a1' : '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="In Progress">⏳ In Progress</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="On Hold">⏸️ On Hold</option>
                  </select>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => handleDeleteProject(p.id)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No projects logged within this classification layer.</div>
        )}
      </div>
    </div>
  );
};