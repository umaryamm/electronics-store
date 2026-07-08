import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProducts, loadProjects } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import ProjectCard from '../components/ProjectCard';

const FEATURES = [
  ['🚀', 'Same-Day Dispatch', "Order before 3 PM and your gear ships the same day. We don't believe in waiting when you're excited about new tech."],
  ['🛡️', '2-Year Warranty', "Every device sold on Vision Giants includes a full 2-year manufacturer's warranty — no asterisks, no hidden terms."],
  ['✅', '100% Authentic', 'We source directly from certified distributors. Counterfeits never touch our shelves. Your trust is non-negotiable.'],
  ['💳', '0% Instalments', 'Split any purchase into 3, 6, or 12 months with zero interest via EasyPaisa, JazzCash, or bank instalments.'],
  ['🔄', '30-Day Returns', 'Changed your mind? Return anything within 30 days, no questions asked. Full refund, hassle-free.'],
  ['🎧', 'Expert Support 24/7', 'Real people, real answers — anytime. Our tech-savvy support team is on call around the clock for you.'],
];

const MARQUEE = [
  'Free Delivery on Orders Above Rs 25,000',
  'New Arrivals Every Week',
  'Authentic Products Only',
  '24/7 Expert Support',
  '2-Year Warranty on All Devices',
  '0% Instalment Plans Available',
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts().then(({ categories, products }) => {
      setCategories(categories);
      setFeaturedProducts(products.slice(0, 8));
    });
    loadProjects().then(({ projects }) => {
      setFeaturedProjects(projects.filter((p) => p.badge === 'POPULAR').slice(0, 4));
    });
  }, []);

  return (
    <>
      <section className="hero" style={{ paddingTop: '64px' }}>
        <div className="hero-eyebrow">✨ New 2025 Collection Live Now</div>
        <h1>See the <span>Future</span> of Technology</h1>
        <p>
          From 3D printers to Arduino modules and robotics parts — Vision Giants brings you the sharpest
          electronics and DIY components, curated for makers who demand more.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate('/products')}>Explore Products</button>
          <button className="btn-primary" onClick={() => navigate('/projects')}>Explore Projects</button>
          <button className="btn-ghost" onClick={() => navigate('/contact')}>Get in Touch</button>
        </div>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px' }}>
          {[['100+', 'Products'], ['50+', 'Projects'], ['98%', 'Satisfaction']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 700, fontSize: '1.4rem', color: 'var(--cyan)' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--gray-mid)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i}>✦ {m}</span>
          ))}
        </div>
      </div>

      <div className="container">
        <section className="section">
          <div className="section-head">
            <div>
              <h2>Shop Categories</h2>
              <p>Explore our full range of premium electronics organized by what matters most to you.</p>
            </div>
          </div>
          <div className="cat-grid">
            {categories.map((cat) => (
              <div key={cat.id} className="cat-card" onClick={() => navigate(`/products?category=${cat.id}`)}>
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count || ''}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Featured Products</h2>
              <p>The season's most sought-after tech — from 3D printers to Arduino-based DIY builds.</p>
            </div>
            <a className="section-link" href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>View All →</a>
          </div>
          <div className="product-grid">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Featured Projects</h2>
              <p>Get inspired with expert-curated projects, from beginner-friendly Arduino builds to advanced robotics systems.</p>
            </div>
            <a className="section-link" href="/projects" onClick={(e) => { e.preventDefault(); navigate('/projects'); }}>View All →</a>
          </div>
          <div className="product-grid">
            {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>

        <section className="section">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
            <h2>Why Vision Giants?</h2>
            <p>We're built for tech lovers who refuse to settle. Every order, every pixel, every watt — obsessively curated.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
            {FEATURES.map(([icon, title, desc]) => (
              <div key={title} className="cat-card" style={{ textAlign: 'left', cursor: 'default' }}>
                <div className="cat-emoji">{icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingBottom: '0' }}>
          <div className="form-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem' }}>Stay Ahead of the <span style={{ color: 'var(--cyan)' }}>Tech Curve</span></h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginTop: '8px' }}>Get early access to launches, exclusive deals, and expert picks — straight to your inbox.</p>
            </div>
            <form style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px 16px', color: 'var(--text)', minWidth: '220px' }} />
              <button className="btn-primary" type="submit">Subscribe →</button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
