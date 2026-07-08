import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Your backend's /api/auth/signup likely just creates the user —
      // it may or may not return a token directly. Safest bet: sign up,
      // then log in right after so the user lands authenticated either way.
      await signup({ name: form.name, email: form.email, password: form.password });
      await login({ email: form.email, password: form.password });
      navigate('/products');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Could not create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '440px' }}>
      <div className="page-header" style={{ textAlign: 'left', padding: '0 0 24px' }}>
        <h1 style={{ textAlign: 'left' }}>Create Account</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="field">
          <label>Full Name</label>
          <input
            required
            placeholder="Ali Raza"
            value={form.name}
            onChange={updateField('name')}
          />
        </div>
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
            minLength={6}
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
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>

        <p style={{ marginTop: '16px', fontSize: '0.85rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}