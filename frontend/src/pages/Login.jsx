import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // For Deliverable 1, just accept test@example.com and any password
    if (email === 'test@example.com') {
      localStorage.setItem('merchantEmail', email);
      localStorage.setItem('apiKey', 'key_test_abc123');
      localStorage.setItem('apiSecret', 'secret_test_xyz789');
      navigate('/dashboard');
    }
  }

  return (
    <form data-test-id="login-form" onSubmit={handleSubmit}>
      <input
        data-test-id="email-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
  data-test-id="password-input"
  type="password"
  placeholder="Password"
  autoComplete="current-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
      <button data-test-id="login-button" type="submit">
        Login
      </button>
    </form>
  );
}
