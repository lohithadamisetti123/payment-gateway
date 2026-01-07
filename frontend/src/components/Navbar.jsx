import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '16px 0',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
            💳 Payment Gateway
          </h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link 
              to="/dashboard"
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--bg-light)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard/transactions"
              style={{
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--bg-light)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              Transactions
            </Link>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-secondary"
          style={{ fontSize: '13px', padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
