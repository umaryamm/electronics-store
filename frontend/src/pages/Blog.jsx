import { useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>The Vision Giants Blog</h1>
        <p>Tutorials, build guides, and tips from makers and engineers — for makers and engineers.</p>
      </div>

      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <div
            className="blog-card"
            key={post.id}
            onClick={() => navigate(`/blog/${post.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="blog-img">{post.emoji}</div>
            <div className="blog-body">
              <div className="blog-meta">📅 {post.date} · 👤 {post.author}</div>
              <div className="blog-title">{post.title}</div>
              <p className="blog-excerpt">{post.excerpt}</p>
              <button
                className="blog-read"
                onClick={(e) => { e.stopPropagation(); navigate(`/blog/${post.id}`); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}