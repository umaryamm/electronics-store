import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

export default function BlogPost() {
  const { id } = useParams();
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Post not found.</p>
          <Link className="btn-primary" to="/blog" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '80px', maxWidth: '820px' }}>
      <div className="breadcrumb" style={{ marginTop: '20px' }}>
        <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> / {post.title}
      </div>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{post.emoji}</div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', marginBottom: '10px' }}>{post.title}</h1>
        <div style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>📅 {post.date} · 👤 {post.author}</div>
      </div>

      <div className="form-card" style={{ lineHeight: 1.75, fontSize: '1rem', color: 'var(--text-sub)' }}>
        {(post.content || [post.excerpt]).map((para, i) => (
          <p key={i} style={{ marginBottom: i === (post.content?.length ?? 1) - 1 ? 0 : '18px' }}>{para}</p>
        ))}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link className="btn-primary" to="/blog" style={{ display: 'inline-flex' }}>← Back to Blog</Link>
      </div>
    </div>
  );
}