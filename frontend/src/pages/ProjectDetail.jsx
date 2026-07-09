import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadProjects } from '../data/catalog';
import { useCart } from '../context/CartContext';
import ProjectCard from '../components/ProjectCard';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setQty(1);
    setNotFound(false);
    setProject(null);

    loadProjects()
      .then(({ projects }) => {
        const found = projects.find((p) => String(p.id) === String(id));
        if (!found) {
          setNotFound(true);
          return;
        }
        setProject(found);
        // Related projects: same category + level, excluding this one.
        const sameCategory = projects.filter(
          (p) => p.categoryId === found.categoryId && p.level === found.level && String(p.id) !== String(id)
        );
        setRelated(sameCategory.slice(0, 4));
      })
      .catch((err) => {
        console.error('Failed to load project:', err);
        setNotFound(true);
      });
  }, [id]);

  if (notFound) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Project not found.</p>
          <Link className="btn-primary" to="/projects" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Projects</Link>
        </div>
      </div>
    );
  }

  if (!project) return <div className="container" style={{ padding: '80px 0' }} />;

  const rating = project.rating || 0;
  const entireStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');
  const imgSrc = typeof project.image === 'string' && project.image.startsWith('http') ? project.image : null;

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/projects">Projects</Link>
        {project.category && (
          <> / <Link to={`/projects?level=${project.level}&category=${project.categoryId}`}>{project.category}</Link></>
        )} / {project.name}
      </div>

      <div className="detail-layout" style={{ marginTop: '20px' }}>
        <div className="detail-img">
          {imgSrc ? (
            <img src={imgSrc} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '6rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {project.emoji || '🛠️'}
            </span>
          )}
          {project.badge && (
            <span className={project.badge.includes('%') ? 'badge-sale' : 'badge-new'} style={{ position: 'absolute', top: 16, left: 16 }}>
              {project.badge}
            </span>
          )}
        </div>

        <div>
          {project.category && <div className="qv-cat">{project.category}</div>}
          <div className="detail-name">{project.name}</div>
          <div className="qv-rating">
            {project.reviews > 0 ? (
              <>{stars} <span>({rating.toFixed(1)} · {project.reviews.toLocaleString()} reviews)</span></>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>

          <div className="detail-price" style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span>{project.difficulty || 'Project'}</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '0.95rem', color: 'var(--gray-mid)' }}>
              · {project.duration}
            </span>
          </div>

          <p style={{ color: 'var(--text-sub)', lineHeight: 1.6, fontSize: '0.95rem' }}>{project.description}</p>

          {project.components?.length > 0 && (
            <div style={{ margin: '8px 0 4px' }}>
              <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>Key Components:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: '18px', color: 'var(--text-sub)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {project.components.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="qty-select-detail">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                addToCart(project.id, qty);
                navigate('/cart');
              }}
            >
              Buy Now
            </button>
            <button className="btn-ghost" onClick={() => addToCart(project.id, qty)}>🛒 Add to Cart</button>
          </div>

          <Link to="/contact" className="btn-ghost" style={{ display: 'inline-flex', marginTop: '14px' }}>
            Request Source Code →
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Similar Projects</h2></div>
          <div className="project-grid-3col">
            {related.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}