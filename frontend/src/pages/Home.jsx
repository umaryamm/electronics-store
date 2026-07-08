import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadProducts, loadProjects } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import ProjectCard from '../components/ProjectCard';
import BorderGlow from '../components/BorderGlow';
import SpotlightCard from '../components/SpotlightCard';

const FEATURES = [
  ['Same-Day Dispatch', "Order before 3 PM and your gear ships the same day. We don't believe in waiting when you're excited about new tech."],
  ['2-Year Warranty', "Every device sold on Vision Giants includes a full 2-year manufacturer's warranty — no asterisks, no hidden terms."],
  ['100% Authentic', 'We source directly from certified distributors. Counterfeits never touch our shelves. Your trust is non-negotiable.'],
  ['0% Instalments', 'Split any purchase into 3, 6, or 12 months with zero interest via EasyPaisa, JazzCash, or bank instalments.'],
  ['30-Day Returns', 'Changed your mind? Return anything within 30 days, no questions asked. Full refund, hassle-free.'],
  ['Expert Support 24/7', 'Real people, real answers — anytime. Our tech-savvy support team is on call around the clock for you.'],
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
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [pressedFeature, setPressedFeature] = useState(null);
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
  const carouselRef = useRef(null);

  // Auto-advance the featured carousel: slide to the next card every 8s
  // Auto-advance the featured carousel: slide to the next card every 5s
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const timer = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const card = el.querySelector('.product-card');
      if (!card) return;
      const step = card.offsetWidth + 20; // card width + gap
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft + step > maxScroll + 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' }); // loop back to start
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts]);

  // Manual prev/next — used by the carousel arrow buttons
  const scrollCarousel = (dir) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector('.product-card');
    if (!card) return;
    const step = card.offsetWidth + 20;
    const current = Math.round(el.scrollLeft / step);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = Math.min(Math.max((current + dir) * step, 0), maxScroll);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

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
          <div className="section-head section-head-center">
            <div>
              <h2>Featured Products</h2>
              <p>The season's most sought-after tech — from 3D printers to Arduino-based DIY builds.</p>
            </div>
            <a className="section-link" href="/products" onClick={(e) => { e.preventDefault(); navigate('/products'); }}>View All →</a>
          </div>
          <div className="carousel-wrap">
            <button className="carousel-arrow prev" onClick={() => scrollCarousel(-1)} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className="product-carousel" ref={carouselRef}>
              {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <button className="carousel-arrow next" onClick={() => scrollCarousel(1)} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
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
          <div className="section-head" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
            <h2>Why Vision Giants?</h2>
            <p style={{ maxWidth: '520px', margin: '0 auto' }}>We're built for tech lovers who refuse to settle. Every order, every pixel, every watt — obsessively curated.</p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              maxWidth: '900px',
              margin: '0 auto',
              alignItems: 'stretch',
            }}
          >
            {FEATURES.map(([title, desc]) => (
              <div
                key={title}
                onMouseEnter={() => setHoveredFeature(title)}
                onMouseLeave={() => { setHoveredFeature(null); setPressedFeature(null); }}
                onMouseDown={() => setPressedFeature(title)}
                onMouseUp={() => setPressedFeature(null)}
                style={{
                  cursor: 'pointer',
                  height: '100%',
                  transform:
                    pressedFeature === title
                      ? 'translateY(-2px) scale(0.97)'
                      : hoveredFeature === title
                      ? 'translateY(-6px) scale(1.02)'
                      : 'translateY(0) scale(1)',
                  transition: 'transform 0.18s ease-out',
                  boxShadow:
                    hoveredFeature === title && pressedFeature !== title
                      ? '0 12px 28px rgba(0,0,0,0.35)'
                      : 'none',
                  borderRadius: '16px',
                }}
              >
                <BorderGlow
                  backgroundColor="#11161f"
                  glowColor="190 90% 65%"
                  colors={['#38bdf8', '#818cf8', '#f472b6']}
                  borderRadius={16}
                  glowRadius={30}
                  edgeSensitivity={35}
                >
                  <SpotlightCard
                    spotlightColor="rgba(56, 189, 248, 0.25)"
                    className="feature-spotlight"
                  >
                    <div style={{ textAlign: 'left', padding: '22px' }}>
                      <h3 style={{ fontSize: '1rem', marginBottom: '6px', fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.55 }}>{desc}</p>
                    </div>
                  </SpotlightCard>
                </BorderGlow>
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