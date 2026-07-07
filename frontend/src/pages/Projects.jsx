import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadProjects } from '../data/catalog';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ projects: [], categories: [] });
  const level = params.get('level') || 'university';
  const activeCategory = params.get('category') || '';

  useEffect(() => {
    loadProjects().then(setData);
  }, []);

  const levelBlock = data.categories.find((c) => c.id === level);

  const filtered = useMemo(() => {
    let list = data.projects.filter((p) => p.level === level);
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory);
    return list;
  }, [data, level, activeCategory]);

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Project Kits & Build Guides</h1>
        <p>From semester assignments to enterprise deployments — ready-to-build project kits with full component lists.</p>
      </div>

      <div className="level-tabs">
        {data.categories.map((cat) => (
          <button
            key={cat.id}
            className={`level-tab${level === cat.id ? ' active' : ''}`}
            onClick={() => setParams({ level: cat.id })}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {levelBlock && (
        <div className="cat-grid" style={{ marginBottom: '40px' }}>
          <div
            className="cat-card"
            style={{ border: !activeCategory ? '1px solid var(--cyan)' : undefined }}
            onClick={() => setParams({ level })}
          >
            <div className="cat-emoji">🗂️</div>
            <div className="cat-name">All</div>
            <div className="cat-count">{data.projects.filter((p) => p.level === level).length}</div>
          </div>
          {levelBlock.subcategories.map((sub) => (
            <div
              key={sub.id}
              className="cat-card"
              style={{ border: activeCategory === sub.id ? '1px solid var(--cyan)' : undefined }}
              onClick={() => setParams({ level, category: sub.id })}
            >
              <div className="cat-emoji">{sub.emoji}</div>
              <div className="cat-name">{sub.name}</div>
              <div className="cat-count">{sub.count}</div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">No projects in this category yet.</div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}
