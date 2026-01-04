import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successRate: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const apiKey = localStorage.getItem('apiKey');
      const apiSecret = localStorage.getItem('apiSecret');

      const res = await axios.get('http://localhost:8000/api/v1/payments-stats', {
        headers: {
          'X-Api-Key': apiKey,
          'X-Api-Secret': apiSecret
        }
      });

      setStats(res.data);
    }
    fetchStats().catch(console.error);
  }, []);

  const apiKey = localStorage.getItem('apiKey');
  const apiSecret = localStorage.getItem('apiSecret');

  const formattedAmount = `₹${(stats.totalAmount / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2
  })}`;

  return (
    <div data-test-id="dashboard">
      <div data-test-id="api-credentials">
        <div>
          <label>API Key</label>
          <span data-test-id="api-key">{apiKey}</span>
        </div>
        <div>
          <label>API Secret</label>
          <span data-test-id="api-secret">{apiSecret}</span>
        </div>
      </div>

      <div data-test-id="stats-container">
        <div data-test-id="total-transactions">{stats.totalTransactions}</div>
        <div data-test-id="total-amount">{formattedAmount}</div>
        <div data-test-id="success-rate">{`${stats.successRate}%`}</div>
      </div>
    </div>
  );
}
