import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PexLogin.css';

const PexLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      navigate('/pex');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="pexlogin-container">
      <div className="pexlogin-box">
        <h2 className="pexlogin-title">Application Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="pexlogin-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="pexlogin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="primary-button" onClick={handleLogin}>Login</button>
        {error && <div className="pexlogin-error">{error}</div>}
      </div>
    </div>
  );
};

export default PexLogin;
