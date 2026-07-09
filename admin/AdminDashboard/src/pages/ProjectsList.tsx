// src/pages/ProjectsList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ContentSection {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Commercial' | 'University';
  completionDate: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  imageUrl: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  introDescription: string;
  introImageUrl: string;
  sections: ContentSection[];
  githubUrl: string;
  price: number; // stored in Indian Rupees (₹)
}

export const makeSectionId = () => `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Formats a numeric amount as Indian Rupees, e.g. 149999 -> ₹1,49,999
export const formatPriceINR = (amount: number) =>
  `${amount.toLocaleString('en-IN')}`;

// Seed data — swap for a fetch/API call later
export const initialProjects: Project[] = [
  {
    id: 'PRJ-001',
    title: 'E-Commerce Marketplace Web App',
    category: 'Commercial',
    completionDate: '2026-05-12',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    isFeatured: true,
    isNewArrival: false,
    introDescription:
      'A full-stack marketplace with product catalog, cart, checkout and an admin dashboard. Built with React on the front end and a Node/Express API, backed by a relational database.',
    introImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    sections: [
      {
        id: makeSectionId(),
        title: 'Wireframing & Planning',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
        description: 'Started with low-fidelity wireframes to map out the checkout flow and admin dashboard layout.'
      },
      {
        id: makeSectionId(),
        title: 'API Integration',
        imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
        description: 'Connected the React front end to the Node/Express API, wiring up auth and cart persistence.'
      },
      {
        id: makeSectionId(),
        title: 'Deployment',
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
        description: 'Shipped to production with CI/CD, environment configs, and a rollback plan.'
      }
    ],
    githubUrl: 'https://github.com/your-org/ecommerce-marketplace',
    price: 149999
  },
  {
    id: 'PRJ-002',
    title: 'Automated Room Mapping Drone Software',
    category: 'University',
    completionDate: '2026-06-20',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500',
    isFeatured: false,
    isNewArrival: true,
    introDescription:
      'A capstone project where a quadcopter maps an indoor room autonomously using onboard sensors and SLAM.',
    introImageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600',
    sections: [
      {
        id: makeSectionId(),
        title: 'Hardware Assembly',
        imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600',
        description: 'Assembled the quadcopter frame, motors, and onboard sensor array.'
      },
      {
        id: makeSectionId(),
        title: 'Firmware & Mapping Pipeline',
        imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600',
        description: 'Flashed the firmware and built the SLAM-based mapping pipeline.'
      }
    ],
    githubUrl: 'https://github.com/your-org/room-mapping-drone',
    price: 89999
  },
  {
    id: 'PRJ-003',
    title: 'Corporate ERP Dashboard Overhaul',
    category: 'Commercial',
    completionDate: '2026-09-01',
    status: 'In Progress',
    imageUrl: '',
    isFeatured: false,
    isNewArrival: false,
    introDescription: '',
    introImageUrl: '',
    sections: [],
    githubUrl: '',
    price: 249999
  }
];

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Commercial' | 'University'>('All');
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  const handleDeleteProject = (id: string) => {
    if (window.confirm(`Permanently remove project entry "${id}" from files?`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Project Portfolio</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track client deliverables, audit capstone developments, and log production timelines.</p>
        </div>
        <button
          onClick={() => navigate('/admin/projects/new')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Project
        </button>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        {(['All', 'Commercial', 'University'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '0.5rem 1.25rem', border: 'none', background: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
              color: activeFilter === tab ? '#3b82f6' : '#64748b',
              borderBottom: activeFilter === tab ? '3px solid #3b82f6' : '3px solid transparent',
              marginBottom: '-11px', transition: 'all 0.2s'
            }}
          >
            {tab === 'All' ? 'All Frameworks' : tab === 'Commercial' ? 'Commercial Core' : 'University Lab'}
          </button>
        ))}
      </div>

      {/* Count Badge */}
      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#475569', fontWeight: '600', backgroundColor: '#e2e8f0', padding: '0.4rem 0.75rem', borderRadius: '0.25rem', display: 'inline-block' }}>
        {filteredProjects.length} {filteredProjects.length === 1 ? 'project entry listed' : 'project entries listed'}
      </div>

      {/* Content Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '110px' }}>Image</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Project Title Name</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '130px' }}>Price</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '160px' }}>Flags</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '180px' }}>Group Classification</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', width: '150px' }}>Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right', width: '190px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => setViewingProject(p)}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '60px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No Img</div>
                  )}
                </td>

                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a', cursor: 'pointer' }} onClick={() => setViewingProject(p)}>
                  {p.title}
                </td>

                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>
                  {formatPriceINR(p.price)}
                </td>

                {/* Flags */}
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                    {p.isFeatured && <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: '#fef9c3', color: '#a16207' }}>Featured</span>}
                    {p.isNewArrival && <span style={{ padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '600', backgroundColor: '#dcfce7', color: '#16a34a' }}>New</span>}
                    {!p.isFeatured && !p.isNewArrival && <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>&mdash;</span>}
                  </div>
                </td>

                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: p.category === 'Commercial' ? '#e0f2fe' : '#f3e8ff', color: p.category === 'Commercial' ? '#0369a1' : '#6b21a8' }}>
                    {p.category}
                  </span>
                </td>

                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: p.status === 'Completed' ? '#dcfce7' : p.status === 'In Progress' ? '#e0f2fe' : '#fee2e2', color: p.status === 'Completed' ? '#16a34a' : p.status === 'In Progress' ? '#0369a1' : '#ef4444' }}>
                    {p.status}
                  </span>
                </td>

                {/* Actions: View, Edit, Delete */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={() => setViewingProject(p)} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                      View
                    </button>
                    <button onClick={() => navigate(`/admin/projects/edit/${p.id}`)} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProject(p.id)} title="Delete Project" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No projects logged within this classification layer.</div>
        )}
      </div>

      {/* ============ DETAIL VIEW MODAL ============ */}
      {viewingProject && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>

            {viewingProject.imageUrl && (
              <div style={{ position: 'relative' }}>
                <img src={viewingProject.imageUrl} alt={viewingProject.title} style={{ width: '100%', height: '220px', objectFit: 'cover', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', display: 'block' }} />
                <button onClick={() => setViewingProject(null)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', border: 'none', background: 'rgba(15,23,42,0.6)', color: '#fff', fontSize: '1.25rem', width: '32px', height: '32px', borderRadius: '9999px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
              </div>
            )}

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{viewingProject.id}</div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{viewingProject.title}</h2>
                </div>
                {!viewingProject.imageUrl && (
                  <button onClick={() => setViewingProject(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: viewingProject.category === 'Commercial' ? '#e0f2fe' : '#f3e8ff', color: viewingProject.category === 'Commercial' ? '#0369a1' : '#6b21a8' }}>{viewingProject.category}</span>
                <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: viewingProject.status === 'Completed' ? '#dcfce7' : viewingProject.status === 'In Progress' ? '#e0f2fe' : '#fee2e2', color: viewingProject.status === 'Completed' ? '#16a34a' : viewingProject.status === 'In Progress' ? '#0369a1' : '#ef4444' }}>{viewingProject.status}</span>
                {viewingProject.isFeatured && <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#fef9c3', color: '#a16207' }}>Featured</span>}
                {viewingProject.isNewArrival && <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#dcfce7', color: '#16a34a' }}>New</span>}
                <span style={{ padding: '0.25rem 0.625rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontWeight: '700', backgroundColor: '#0f172a', color: '#fff' }}>{formatPriceINR(viewingProject.price)}</span>
                <span style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#64748b' }}>Completion: {viewingProject.completionDate}</span>
              </div>

              {(viewingProject.introDescription || viewingProject.introImageUrl) && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '0 0 0.75rem 0' }}>About this project</h3>
                  {viewingProject.introImageUrl && (
                    <img src={viewingProject.introImageUrl} alt="Intro" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }} />
                  )}
                  {viewingProject.introDescription && (
                    <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{viewingProject.introDescription}</p>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#1e293b', margin: '0 0 0.75rem 0' }}>Working Process</h3>
                {viewingProject.sections.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {viewingProject.sections.map((section, i) => (
                      <div key={section.id} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        {section.imageUrl && (
                          <img src={section.imageUrl} alt={section.title || `Section ${i + 1}`} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                        )}
                        <div style={{ padding: '1rem' }}>
                          {section.title && (
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: '600' }}>{section.title}</h4>
                          )}
                          {section.description && (
                            <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{section.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No sections added yet. Use Edit to add them.</p>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                {viewingProject.githubUrl ? (
                  <a href={viewingProject.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: '#0f172a', color: '#fff', textDecoration: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.9rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                    </svg>
                    View Source on GitHub
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.875rem' }}>No repository link added yet.</span>
                )}
                <button onClick={() => setViewingProject(null)} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.375rem', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};