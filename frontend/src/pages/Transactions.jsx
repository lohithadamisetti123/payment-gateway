import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Transactions() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      navigate('/login');
      return;
    }

    async function fetchPayments() {
      try {
        const apiSecret = localStorage.getItem('apiSecret');
        const res = await axios.get('http://localhost:8000/api/v1/payments-list', {
          headers: {
            'X-Api-Key': apiKey,
            'X-Api-Secret': apiSecret
          }
        });
        setPayments(res.data.payments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [navigate]);

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatAmount(amount) {
    return `₹${(amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  function getStatusBadge(status) {
    const badges = {
      success: 'badge-success',
      failed: 'badge-error',
      processing: 'badge-processing'
    };
    return badges[status] || 'badge-warning';
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="text-muted">Loading transactions...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="container">
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Transactions</h1>
            <p className="text-muted">{filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''} found</p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setFilter('all')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              All
            </button>
            <button 
              className={filter === 'success' ? 'btn-success' : 'btn-secondary'}
              onClick={() => setFilter('success')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Success
            </button>
            <button 
              className={filter === 'failed' ? 'btn-error' : 'btn-secondary'}
              onClick={() => setFilter('failed')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Failed
            </button>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ marginBottom: '8px' }}>No transactions found</h3>
            <p className="text-muted">Transactions will appear here once you process payments.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table data-test-id="transactions-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} data-test-id="transaction-row" data-payment-id={p.id}>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '13px',
                        color: 'var(--primary)'
                      }} data-test-id="payment-id">
                        {p.id}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '13px' 
                      }} data-test-id="order-id">
                        {p.order_id}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }} data-test-id="amount">
                        {formatAmount(p.amount)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: 'var(--bg-light)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }} data-test-id="method">
                        {p.method === 'upi' ? '📱' : '💳'} {p.method}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(p.status)}`} data-test-id="status">
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted" style={{ fontSize: '13px' }} data-test-id="created-at">
                        {formatDate(p.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
