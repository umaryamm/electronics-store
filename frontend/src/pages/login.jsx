import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email: form.email, password: form.password });
      navigate('/products');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '440px' }}>
      <div className="page-header" style={{ textAlign: 'left', padding: '0 0 24px' }}>
        <h1 style={{ textAlign: 'left' }}>Log In</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField('email')}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={form.password}
            onChange={updateField('password')}
          />
        </div>

        {error && (
          <p style={{ color: '#c0392b', marginTop: '10px', fontSize: '0.85rem' }}>{error}</p>
        )}

        <button
          className="btn-primary"
          type="submit"
          disabled={submitting}
          style={{ width: '100%', justifyContent: 'center', marginTop: '18px' }}
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        <p style={{ marginTop: '16px', fontSize: '0.85rem', textAlign: 'center' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}