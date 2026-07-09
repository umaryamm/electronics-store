import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProjects } from '../api/projectService';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = params.get('category') || 'University';

  useEffect(() => {
    const fetchProjects = async () => {
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

  if (loading) return <div className="container">Loading projects...</div>;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Project Kits & Build Guides</h1>
        <p>From semester assignments to enterprise deployments — ready-to-build project kits with full component lists.</p>
      </div>

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

      {projects.length === 0 ? (
        <div className="empty-state">No projects yet.</div>
      ) : (
        <div className="product-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}