import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadProjects } from '../data/catalog';
import ProjectCard from '../components/ProjectCard';

// Options for the right-side "New Arrival / Featured" filter.
// Matches against each project's `badge` field — adjust the matcher below
// if your projects.json uses a different field (e.g. isNew / featured booleans).
const BADGE_FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'new', label: '🆕 New Arrivals' },
  { id: 'featured', label: '⭐ Featured' },
];

function matchesBadgeFilter(project, filterId) {
  if (filterId === 'all') return true;
  const badge = (project.badge || '').toLowerCase();
  if (filterId === 'new') return badge.includes('new');
  if (filterId === 'featured') return badge.includes('featured') || badge.includes('popular');
  return true;
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ projects: [], categories: [] });
  const [badgeFilter, setBadgeFilter] = useState('all');
  const level = params.get('level') || 'university';
  const activeCategory = params.get('category') || '';

  useEffect(() => {
    loadProjects().then(setData);
  }, []);

  const levelBlock = data.categories.find((c) => c.id === level);

  const filtered = useMemo(() => {
    let list = data.projects.filter((p) => p.level === level);
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory);
    list = list.filter((p) => matchesBadgeFilter(p, badgeFilter));
    return list;
  }, [data, level, activeCategory, badgeFilter]);

  // Changing level resets the category, same behavior as the old level tabs.
  const handleLevelChange = (e) => setParams({ level: e.target.value });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) setParams({ level, category: value });
    else setParams({ level });
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Project Kits & Build Guides</h1>
        <p>From semester assignments to enterprise deployments — ready-to-build project kits with full component lists.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        {/* Left: category dropdown (subcategories of the current level) */}
        <select
          value={activeCategory}
          onChange={handleCategoryChange}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', width: '100%', justifySelf: 'start' }}
        >
          <option value="">🗂️ All Categories</option>
          {levelBlock?.subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.emoji} {sub.name} ({sub.count})
            </option>
          ))}
        </select>

        {/* Middle: level dropdown */}
        <select
          value={level}
          onChange={handleLevelChange}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', width: '100%', maxWidth: '280px', justifySelf: 'center' }}
        >
          {data.categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.name}
            </option>
          ))}
        </select>

        {/* Right: new arrival / featured filter */}
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', width: '100%', justifySelf: 'end' }}
        >
          {BADGE_FILTERS.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No projects in this category yet.</div>
      ) : (
        <div className="project-grid-3col">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}