import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchPayments() {
      const apiKey = localStorage.getItem('apiKey');
      const apiSecret = localStorage.getItem('apiSecret');

      const res = await axios.get('http://localhost:8000/api/v1/payments-list', {
        headers: {
          'X-Api-Key': apiKey,
          'X-Api-Secret': apiSecret
        }
      });

      setPayments(res.data.payments);
    }
    fetchPayments().catch(console.error);
  }, []);

  return (
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
        {payments.map((p) => (
          <tr key={p.id} data-test-id="transaction-row" data-payment-id={p.id}>
            <td data-test-id="payment-id">{p.id}</td>
            <td data-test-id="order-id">{p.order_id}</td>
            <td data-test-id="amount">{p.amount}</td>
            <td data-test-id="method">{p.method}</td>
            <td data-test-id="status">{p.status}</td>
            <td data-test-id="created-at">{p.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
