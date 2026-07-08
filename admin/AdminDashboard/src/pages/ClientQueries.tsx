// src/pages/ClientQueries.tsx
import React, { useState } from 'react';

interface Query {
  id: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
}

export const ClientQueries: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([
    {
      id: 'QRY-9921',
      clientName: 'John Doe',
      clientEmail: 'john.doe@example.com',
      subject: 'Damaged item delivery complaint',
      message: 'My package arrived with a cracked screen cover. Can I get a tracking identifier replacement setup quickly?',
      date: '2026-06-30 11:20',
      status: 'Unread',
      priority: 'High'
    },
    {
      id: 'QRY-9844',
      clientName: 'Alice Smith',
      clientEmail: 'alice@domain.com',
      subject: 'Bulk custom ordering quote inquiry',
      message: 'Looking to purchase 50 units of the wireless desk organizers for our main branch office workspace.',
      date: '2026-06-29 16:45',
      status: 'In Progress',
      priority: 'Medium'
    },
    {
      id: 'QRY-9710',
      clientName: 'Robert Lee',
      clientEmail: 'boblee@gmail.com',
      subject: 'Refund status inquiry',
      message: 'Initiated a refund item cancellation two days ago. Wanted to verify if processing has cleared your system.',
      date: '2026-06-28 09:12',
      status: 'Resolved',
      priority: 'Low'
    }
  ]);

  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const handleStatusChange = (id: string, newStatus: Query['status']) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    if (selectedQuery && selectedQuery.id === id) {
      setSelectedQuery(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteQuery = (id: string) => {
    if (window.confirm(`Permanently remove client ticket records for "${id}"?`)) {
      setQueries(prev => prev.filter(q => q.id !== id));
      setSelectedQuery(null);
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Client Support Tickets</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Review buyer messages, manage priority queues, and update customer ticket logs.</p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Ticket ID</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Client</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Subject</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setSelectedQuery(q)}>
                  {q.id}
                </td>
                <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{q.clientName}</td>
                <td style={{ padding: '1rem', color: '#475569' }}>{q.subject}</td>
                
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: q.status === 'Unread' ? '#fee2e2' : q.status === 'In Progress' ? '#e0f2fe' : '#dcfce7', color: q.status === 'Unread' ? '#ef4444' : q.status === 'In Progress' ? '#0284c7' : '#16a34a' }}>
                    {q.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={() => setSelectedQuery(q)} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}>
                      Review Message
                    </button>
                    <button onClick={() => handleDeleteQuery(q.id)} style={{ padding: '0.375rem 0.625rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Query Detail Modal Drawer Layout */}
      {selectedQuery && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', width: '100%', maxWidth: '600px', padding: '2rem', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Ticket Log: {selectedQuery.id}</h3>
              <button onClick={() => setSelectedQuery(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '1.25rem', fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>
              <div>👤 <strong>Sender Name:</strong> {selectedQuery.clientName}</div>
              <div>✉️ <strong>Email Link:</strong> <a href={`mailto:${selectedQuery.clientEmail}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{selectedQuery.clientEmail}</a></div>
              <div>📅 <strong>Sent Date:</strong> {selectedQuery.date}</div>
              <div>📌 <strong>Subject Core:</strong> {selectedQuery.subject}</div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.925rem', color: '#0f172a', whiteSpace: 'pre-line' }}>
              <strong>Client Message Content:</strong><br/>
              {selectedQuery.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <div>
                <label style={{ marginRight: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Fulfillment State:</label>
                <select value={selectedQuery.status} onChange={(e) => handleStatusChange(selectedQuery.id, e.target.value as Query['status'])} style={{ padding: '0.375rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}>
                  <option value="Unread">Unread</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <button onClick={() => setSelectedQuery(null)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '0.375rem', color: '#1e293b', fontWeight: '500', cursor: 'pointer' }}>
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};