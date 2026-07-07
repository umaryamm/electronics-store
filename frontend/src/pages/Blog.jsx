import { BLOG_POSTS } from '../data/blogPosts';

export default function Blog() {
  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>The Vision Giants Blog</h1>
        <p>Tutorials, build guides, and tips from makers and engineers — for makers and engineers.</p>
      </div>

      <div className="blog-grid">
        {BLOG_POSTS.map((post) => (
          <div className="blog-card" key={post.id}>
            <div className="blog-img">{post.emoji}</div>
            <div className="blog-body">
              <div className="blog-meta">📅 {post.date} · 👤 {post.author}</div>
              <div className="blog-title">{post.title}</div>
              <p className="blog-excerpt">{post.excerpt}</p>
              <span className="blog-read">Read More →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
