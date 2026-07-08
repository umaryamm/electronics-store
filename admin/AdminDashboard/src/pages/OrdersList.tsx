// src/pages/OrdersList.tsx
import React, { useState } from 'react';
import productsData from '../products.json'; 
import { Order } from '../types';

export const OrdersList: React.FC = () => {
  const mockProductA = productsData.products[0];
  const mockProductB = productsData.products[1];

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2026-9941',
      customerName: 'Alex Mercer',
      customerEmail: 'alex@example.com',
      customerPhone: '+1 (555) 234-5678',
      orderDate: '2026-06-28 14:32',
      totalAmount: 1199,
      status: 'Pending',
      items: [
        { productId: mockProductA?.id || 'id1', name: mockProductA?.name || 'Item 1', price: mockProductA?.price || 1199, quantity: 1 }
      ],
      shippingAddress: '123 Tech Way, Silicon Valley, CA 94025',
      shippingMethod: 'Express Courier Logistics',
      paymentMethod: 'Credit Card (Visa ending 4242)',
      trackingNumber: '',
      breakdown: { subtotal: 1199, shipping: 0, tax: 95, discount: 0 }
    },
    {
      id: 'ORD-2026-9942',
      customerName: 'Sarah Connor',
      customerEmail: 's.connor@example.com',
      customerPhone: '+1 (555) 987-6543',
      orderDate: '2026-06-29 09:15',
      totalAmount: 1328,
      status: 'Paid',
      items: [
        { productId: mockProductB?.id || 'id2', name: mockProductB?.name || 'Item 2', price: mockProductB?.price || 1279, quantity: 1 },
        { productId: 'usbchubaluminum', name: 'USB-C Hub 7-in-1 Aluminum', price: 49, quantity: 1 }
      ],
      shippingAddress: '742 Evergreen Terrace, Springfield, IL 62704',
      shippingMethod: 'Standard Ground Delivery',
      paymentMethod: 'PayPal Secure',
      trackingNumber: 'TRK88391024X',
      breakdown: { subtotal: 1328, shipping: 15, tax: 105, discount: 120 }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    alert('Order status updated');
  };

  const handleSaveTracking = (orderId: string) => {
    if (!trackingInput.trim()) {
      alert('Please enter a valid tracking reference text.');
      return;
    }
    setOrders(prevOrders =>
      prevOrders.map(order => (order.id === orderId ? { ...order, trackingNumber: trackingInput } : order))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, trackingNumber: trackingInput } : null);
    }
    alert('Tracking number saved! Customer alert dispatched.');
    setTrackingInput('');
  };

  // 🗑️ Delete Order Handler
  const handleDeleteOrder = (id: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete order "${id}"?`);
    if (confirmDelete) {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      alert('Order deleted!');
    }
  };

  return (
    <div>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Order Fulfillment Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Fulfill client invoices, modify pipeline lifecycle status, and input tracking identifiers.</p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Order ID</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Customer</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Order Date</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Total Amount</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>Fulfillment Status</th>
              <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#3b82f6', cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                  {order.id}
                </td>
                <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{order.customerName}</td>
                <td style={{ padding: '1rem', color: '#64748b' }}>{order.orderDate}</td>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#0f172a' }}>${order.totalAmount}</td>
                
                <td style={{ padding: '1rem' }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    style={{
                      padding: '0.375rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Paid">💳 Paid</option>
                    <option value="Shipped">📦 Shipped</option>
                    <option value="Out for Delivery">🚚 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </td>

                {/* 🛠️ Action Buttons Column (With new Delete Button) */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => { setSelectedOrder(order); setTrackingInput(order.trackingNumber || ''); }}
                      style={{ padding: '0.375rem 0.75rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' }}
                    >
                      View Details
                    </button>
                    {/* Clean SVG Outline Delete Button */}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      title="Delete Order"
                      style={{ 
                        padding: '0.375rem 0.625rem', 
                        backgroundColor: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg 
                        width="20" 
                        height="22" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal View Details */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '0.5rem', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Detailed Summary: {selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div><strong>Client Name:</strong> {selectedOrder.customerName}</div>
              <div><strong>Email Log:</strong> {selectedOrder.customerEmail}</div>
              <div><strong>Phone Contact:</strong> {selectedOrder.customerPhone}</div>
              <div><strong>Date Stamps:</strong> {selectedOrder.orderDate}</div>
            </div>

            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#1e293b' }}>Line Items Ledger</h4>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.375rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: index === selectedOrder.items.length - 1 ? 'none' : '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontWeight: '600' }}>{item.name}</span>
                    <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>x{item.quantity}</span>
                  </div>
                  <div style={{ fontWeight: '500' }}>${item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* Logistics Framework Info (Merchant Billing gateway has been removed) */}
            <div style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              <div>📍 <strong>Shipping Destination Address:</strong> {selectedOrder.shippingAddress}</div>
              <div>🚚 <strong>Chosen Courier Route Method:</strong> {selectedOrder.shippingMethod}</div>
            </div>

            <div style={{ width: '220px', marginLeft: 'auto', fontSize: '0.875rem', borderTop: '2px solid #e2e8f0', paddingTop: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>Subtotal:</span><span>${selectedOrder.breakdown.subtotal}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>Tax:</span><span>${selectedOrder.breakdown.tax}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span>Shipping fee:</span><span>${selectedOrder.breakdown.shipping}</span></div>
              {selectedOrder.breakdown.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: '#ef4444' }}><span>Discounts Applied:</span><span>-${selectedOrder.breakdown.discount}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1rem', borderTop: '1px solid #cbd5e1', paddingTop: '0.25rem', marginTop: '0.25rem' }}><span>Grand Total:</span><span>${selectedOrder.totalAmount}</span></div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#344155' }}>
                Courier Dispatch Tracking Identifier Code
              </label>
              {selectedOrder.trackingNumber ? (
                <div style={{ padding: '0.625rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '0.375rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📦 Live tracking reference saved: <strong>{selectedOrder.trackingNumber}</strong></span>
                  <button onClick={() => handleStatusChange(selectedOrder.id, 'Shipped')} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>Mark Shipped</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter waypoint / tracking number (e.g. DHL-9921)"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem' }}
                  />
                  <button
                    onClick={() => handleSaveTracking(selectedOrder.id)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Save Tracking
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};