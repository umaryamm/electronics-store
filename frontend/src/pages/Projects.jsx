import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProjects } from '../api/projectService';
import ProjectCard from '../components/ProjectCard';

const BADGE_FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'new', label: '🆕 New Arrivals' },
  { id: 'featured', label: '⭐ Featured' },
];

function matchesBadgeFilter(project, filterId) {
  if (filterId === 'all') return true;
  if (filterId === 'new') return Boolean(project.isNewArrival);
  if (filterId === 'featured') return Boolean(project.isFeatured);
  return true;
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badgeFilter, setBadgeFilter] = useState('all');
  const activeCategory = params.get('category') || 'University';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await getProjects({ category: activeCategory });
        setProjects(res.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory]);

  const filtered = useMemo(
    () => projects.filter((p) => matchesBadgeFilter(p, badgeFilter)),
    [projects, badgeFilter]
  );

  if (loading) return <div className="container">Loading projects...</div>;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Project Kits & Build Guides</h1>
        <p>From semester assignments to enterprise deployments — ready-to-build project kits with full component lists.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div className="level-tabs">
          {['University', 'Commercial'].map((cat) => (
            <button
              key={cat}
              className={`level-tab${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setParams({ category: cat })}
            >
              {cat === 'University' ? 'University Lab' : 'Commercial Core'}
            </button>
          ))}
        </div>

        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', width: '100%', maxWidth: '280px', justifySelf: 'end' }}
        >
          {BADGE_FILTERS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No projects in this category yet.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}