import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Checkout() {
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(null);
  const [vpa, setVpa] = useState('');
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const orderId = new URLSearchParams(window.location.search).get('order_id');

  useEffect(() => {
    async function fetchOrder() {
      const res = await axios.get(`http://localhost:8000/api/v1/orders/${orderId}/public`);
      setOrder(res.data);
    }
    if (orderId) {
      fetchOrder().catch(console.error);
    }
  }, [orderId]);

  async function submitUPI(e) {
    e.preventDefault();
    setProcessing(true);
    setStatus(null);
    setErrorMessage('');
    try {
      const res = await axios.post('http://localhost:8000/api/v1/payments/public', {
        order_id: orderId,
        method: 'upi',
        vpa
      });
      setPaymentId(res.data.id);
      setStatus(res.data.status);
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.description || 'Payment could not be processed');
      setStatus('failed');
    } finally {
      setProcessing(false);
    }
  }

  async function submitCard(e) {
    e.preventDefault();
    setProcessing(true);
    setStatus(null);
    setErrorMessage('');
    try {
      const [month, year] = card.expiry.split('/');
      const res = await axios.post('http://localhost:8000/api/v1/payments/public', {
        order_id: orderId,
        method: 'card',
        card: {
          number: card.number,
          expiry_month: month,
          expiry_year: year,
          cvv: card.cvv,
          holder_name: card.holder
        }
      });
      setPaymentId(res.data.id);
      setStatus(res.data.status);
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.description || 'Payment could not be processed');
      setStatus('failed');
    } finally {
      setProcessing(false);
    }
  }

  function retry() {
    setStatus(null);
    setPaymentId(null);
    setErrorMessage('');
  }

  const displayAmount = order
    ? `₹${(order.amount / 100).toFixed(2)}`
    : '';

  return (
    <div data-test-id="checkout-container">
      <div data-test-id="order-summary">
        <h2>Complete Payment</h2>
        <div>
          <span>Amount: </span>
          <span data-test-id="order-amount">{displayAmount}</span>
        </div>
        <div>
          <span>Order ID: </span>
          <span data-test-id="order-id">{orderId}</span>
        </div>
      </div>

      <div data-test-id="payment-methods">
        <button
          data-test-id="method-upi"
          data-method="upi"
          onClick={() => setMethod('upi')}
        >
          UPI
        </button>
        <button
          data-test-id="method-card"
          data-method="card"
          onClick={() => setMethod('card')}
        >
          Card
        </button>
      </div>

      <form
        data-test-id="upi-form"
        style={{ display: method === 'upi' ? 'block' : 'none' }}
        onSubmit={submitUPI}
      >
        <input
          data-test-id="vpa-input"
          placeholder="username@bank"
          type="text"
          value={vpa}
          onChange={(e) => setVpa(e.target.value)}
        />
        <button data-test-id="pay-button" type="submit">
          Pay {displayAmount}
        </button>
      </form>

      <form
        data-test-id="card-form"
        style={{ display: method === 'card' ? 'block' : 'none' }}
        onSubmit={submitCard}
      >
        <input
          data-test-id="card-number-input"
          placeholder="Card Number"
          type="text"
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e.target.value })}
        />
        <input
          data-test-id="expiry-input"
          placeholder="MM/YY"
          type="text"
          value={card.expiry}
          onChange={(e) => setCard({ ...card, expiry: e.target.value })}
        />
        <input
          data-test-id="cvv-input"
          placeholder="CVV"
          type="text"
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value })}
        />
        <input
          data-test-id="cardholder-name-input"
          placeholder="Name on Card"
          type="text"
          value={card.holder}
          onChange={(e) => setCard({ ...card, holder: e.target.value })}
        />
        <button data-test-id="pay-button" type="submit">
          Pay {displayAmount}
        </button>
      </form>

      <div
        data-test-id="processing-state"
        style={{ display: processing ? 'block' : 'none' }}
      >
        <div className="spinner"></div>
        <span data-test-id="processing-message">Processing payment...</span>
      </div>

      <div
        data-test-id="success-state"
        style={{ display: status === 'success' ? 'block' : 'none' }}
      >
        <h2>Payment Successful!</h2>
        <div>
          <span>Payment ID: </span>
          <span data-test-id="payment-id">{paymentId}</span>
        </div>
        <span data-test-id="success-message">
          Your payment has been processed successfully
        </span>
      </div>

      <div
        data-test-id="error-state"
        style={{ display: status === 'failed' ? 'block' : 'none' }}
      >
        <h2>Payment Failed</h2>
        <span data-test-id="error-message">
          {errorMessage || 'Payment could not be processed'}
        </span>
        <button data-test-id="retry-button" onClick={retry}>
          Try Again
        </button>
      </div>
    </div>
  );
}
