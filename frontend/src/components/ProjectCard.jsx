import { useQuickView } from '../context/QuickViewContext';

export default function ProjectCard({ project }) {
  const { openProjectQuickView } = useQuickView();

  const entireStars = Math.floor(project.rating || 0);
  const hasHalfStar = (project.rating || 0) % 1 !== 0;
  const stars = '★'.repeat(entireStars) + (hasHalfStar ? '☆' : '');

  return (
    <div className="product-card" onClick={() => openProjectQuickView(project)}>
      <div className="product-img">
        {project.emoji}
        {project.badge && (
          <span className={project.badge.includes('%') ? 'badge-sale' : 'badge-new'}>{project.badge}</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-cat">{project.category}</div>
        <div className="product-name">{project.name}</div>
        <div className="product-rating">
          {project.rating ? (
            <>
              {stars} <span>({project.rating} · {(project.reviews || 0).toLocaleString()} reviews)</span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
        <div className="product-footer">
          <div className="product-price" style={{ fontSize: '0.82rem' }}>
            {project.difficulty} · {project.duration}
          </div>
        </div>
        <div className="product-actions">
          <button
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              openProjectQuickView(project);
            }}
          >
            View Details
          </button>
          <a className="btn-quick-view" href="/contact" onClick={(e) => e.stopPropagation()}>
            Get Quote
          </a>
        </div>
      </div>
    </div>
  );
}
