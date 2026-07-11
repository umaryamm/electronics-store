import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  ['/account', 'Dashboard'],
  ['/account/orders', 'Orders'],
  ['/account/addresses', 'Addresses'],
  ['/account/details', 'Account details'],
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div style={{ borderBottom: '1px solid var(--border, #e2e8f0)', paddingBottom: '16px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', letterSpacing: '0.03em' }}>MY ACCOUNT</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px' }}>
        <aside>
          <div style={{ padding: '10px 0', marginBottom: '8px', fontSize: '0.9rem' }}>
            {user?.name} <span style={{ color: 'var(--text-sub, #94a3b8)', fontStyle: 'italic' }}>#{user?.id}</span>
          </div>
          <nav style={{ borderTop: '1px solid var(--border, #e2e8f0)' }}>
            {NAV_ITEMS.map(([to, label]) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'block', padding: '12px 4px',
                    borderBottom: '1px solid var(--border, #e2e8f0)',
                    borderLeft: active ? '3px solid #3b5a80' : '3px solid transparent',
                    paddingLeft: active ? '13px' : '16px',
                    fontWeight: active ? 700 : 500,
                    letterSpacing: '0.03em', fontSize: '0.85rem',
                    color: 'var(--text, #1e293b)', textDecoration: 'none'
                  }}
                >
                  {label.toUpperCase()}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
                borderBottom: '1px solid var(--border, #e2e8f0)', background: 'none', border: 'none',
                borderLeft: '3px solid transparent', letterSpacing: '0.03em', fontSize: '0.85rem',
                fontWeight: 500, color: 'var(--text, #1e293b)', cursor: 'pointer'
              }}
            >
              LOGOUT
            </button>
          </nav>
        </aside>

        <main><Outlet /></main>
      </div>
    </div>
  );
}