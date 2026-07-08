import { useNavigate } from 'react-router-dom';
import { useQuickView } from '../context/QuickViewContext';

const WHATSAPP_NUMBER = '923000000000'; // ← your real WhatsApp number, no + sign

// Same skeleton as ProductCard / New Arrival cards — square 1:1 image,
// identical paddings and button row — so all carousel cards share the
// exact same width and height. (Previously this file was a broken copy
// of ProductCard that expected a `product` prop; it now correctly takes
// `project`.)
export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { openProjectQuickView } = useQuickView();

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in the project kit: ${project.name}`
  )}`;

  const imgSrc = typeof project.image === 'string' && project.image.startsWith('http') ? project.image : null;

  return (
    <div className="product-card" onClick={() => openProjectQuickView(project)}>
      {project.badge && (
        <div
          style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'var(--cyan)', color: '#000',
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', zIndex: 1,
          }}
        >
          {project.badge}
        </div>
      )}

      {/* Square image area — identical to New Arrival card */}
      <div
        style={{
          width: '100%', aspectRatio: '1', background: 'var(--bg3)', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
        }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.4rem' }}>{project.emoji || '🛠️'}</span>
        )}
      </div>

      <div style={{ padding: '12px 4px 4px' }}>
        <div
          style={{
            fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', cursor: 'pointer',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', minHeight: '2.4em', lineHeight: 1.2,
          }}
        >
          {project.name}
        </div>

        {/* Meta row sits where the price row sits on product cards, keeping heights equal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', minHeight: '32px' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--cyan)', fontWeight: 700 }}>
            {project.difficulty || 'Project'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>
            {project.duration || ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-primary"
            style={{ flex: 1, padding: '9px', fontSize: '0.8rem', justifyContent: 'center' }}
            onClick={(e) => { e.stopPropagation(); openProjectQuickView(project); }}
          >
            Quick View
          </button>
          <a
            className="btn-ghost"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, padding: '9px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
              <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.74 13.4L3 21l3.7-1.27a8.93 8.93 0 0 0 4.34 1.1h.01a8.94 8.94 0 0 0 8.93-8.93 8.87 8.87 0 0 0-2.38-5.58zM12.05 19.4h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.95.94-2.73-.18-.28A7.42 7.42 0 1 1 19.5 12a7.45 7.45 0 0 1-7.45 7.4z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}