import { useState } from 'react';
import { submitQuery } from '../api/queryService';

const EMPTY_FORM = { clientName: '', clientEmail: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      await submitQuery(form);
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div className="page-header">
        <h1>Get in Touch</h1>
        <p>Questions about an order, a product, or a project kit? We'd love to hear from you.</p>
      </div>

      <div className="detail-layout">
        <div>
          <div className="form-card" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '4px' }}>📞 Phone Support</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>+92 300 0000000 · Mon–Sat, 10am–7pm</p>
          </div>
          <div className="form-card" style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '4px' }}>✉️ Email Us</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>support@visiongiants.pk</p>
          </div>
          <div className="form-card">
            <h3 style={{ marginBottom: '4px' }}>📍 Visit Us</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>Multan, Punjab, Pakistan</p>
          </div>
        </div>

        <div className="form-card">
          <h3>Send a Message</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', marginBottom: '20px' }}>
            Fill out the form below and we'll get back to you shortly.
          </p>

          {status === 'success' && (
            <div style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
              Thanks! Your message has been sent — we'll reply soon.
            </div>
          )}

          {status === 'error' && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Name</label>
                <input name="clientName" required placeholder="Your name" value={form.clientName} onChange={handleChange} />
              </div>
              <div className="field">
                <label>Email</label>
                <input name="clientEmail" type="email" required placeholder="you@example.com" value={form.clientEmail} onChange={handleChange} />
              </div>
            </div>
            <div className="field">
              <label>Subject</label>
              <input name="subject" required placeholder="How can we help?" value={form.subject} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea name="message" required rows={5} placeholder="Tell us more..." value={form.message} onChange={handleChange} />
            </div>
            <button className="btn-primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
