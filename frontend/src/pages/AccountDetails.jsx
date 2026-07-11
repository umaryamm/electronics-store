import { useEffect, useState } from 'react';
import { getMe, updateMe } from '../api/authService';
import { useAuth } from '../context/AuthContext';

export default function AccountDetails() {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMe()
      .then((u) => setForm((f) => ({ ...f, name: u.name, email: u.email })))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await updateMe({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      });
      setMessage('Account updated successfully.');
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update account.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading account details...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="field">
        <label>Display name / email address *</label>
        <input
          type="email" required value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="field">
        <label>Full name *</label>
        <input
          required value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <h4 style={{ borderTop: '1px solid var(--border, #e2e8f0)', paddingTop: '16px', marginTop: '8px' }}>Password Change</h4>

      <div className="field">
        <label>Current password (leave blank to leave unchanged)</label>
        <input
          type="password" value={form.currentPassword}
          onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
        />
      </div>
      <div className="field">
        <label>New password (leave blank to leave unchanged)</label>
        <input
          type="password" value={form.newPassword}
          onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
        />
      </div>
      <div className="field">
        <label>Confirm new password</label>
        <input
          type="password" value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
        />
      </div>

      {error && <p style={{ color: '#c0392b', fontSize: '0.85rem' }}>{error}</p>}
      {message && <p style={{ color: '#0a7d3c', fontSize: '0.85rem' }}>{message}</p>}

      <button className="btn-primary" type="submit" disabled={saving} style={{ alignSelf: 'flex-start' }}>
        {saving ? 'Saving...' : 'SAVE CHANGES'}
      </button>
    </form>
  );
}