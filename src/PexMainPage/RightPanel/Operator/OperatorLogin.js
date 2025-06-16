import React, { useState, useEffect } from 'react';
import './Operator.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OperatorLogin() {
  const [scanCode, setScanCode] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loggedInOperator, setLoggedInOperator] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error("Failed to load operator data:", err));

    const stored = localStorage.getItem('loggedOperator');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLoggedInOperator(parsed);
      } catch (e) {
        console.error("Failed to parse stored operator:", e);
      }
    }
  }, []);

  const handleLogin = () => {
    if (loggedInOperator) {
      setError('An operator is already logged in. Please logout first.');
      return;
    }

    const user = users.find(
      u => u.scanCode === scanCode && u.password === password
    );

    if (user) {
      setSelectedUser(user);
      setError('');
    } else {
      setError('Invalid scan code or password.');
      setSelectedUser(null);
    }
  };

  const handleConfirm = () => {
    localStorage.setItem('operatorLoggedIn', 'true');
    localStorage.setItem('loggedOperator', JSON.stringify(selectedUser));
    setLoggedInOperator(selectedUser);
    setSelectedUser(null);
    toast.success(`Operator ${selectedUser.name} logged in`, {
      autoClose: 3000,
      position: "top-center"
    });

    setRedirecting(true);
    setTimeout(() => {
      navigate('/pex');
    }, 5000);
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('operatorLoggedIn');
    localStorage.removeItem('loggedOperator');
    setLoggedInOperator(null);
    setScanCode('');
    setPassword('');
    toast.info('Operator logged out successfully!', {
      autoClose: 3000,
      position: "top-center"
    });
  };

  const handleBack = () => {
    navigate('/pex');
  };

  return (
    <div className="operator-login">
      <ToastContainer />
      <h2>Operator Login</h2>

      {loggedInOperator ? (
        <>
          <label>Operator Scan Code</label>
          <input
            type="text"
            placeholder="Scan Code"
            value={scanCode}
            onChange={e => setScanCode(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="primary-button" onClick={handleLogin}>Login</button>
          <button className="primary-button" onClick={handleBack}>Cancel</button>
          {error && <p className="error">{error}</p>}

          <div className='gap-login-screen'></div>
          <table className="operator-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Scan Code</th>
                <th>Logout</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{loggedInOperator.id}</td>
                <td>{loggedInOperator.name}</td>
                <td>{loggedInOperator.scanCode} </td>
                <td>
                  <button className="logout-cross" onClick={handleLogout}>✖</button>
                </td>
              </tr>
            </tbody>
          </table>

          {redirecting && (
            <div className="redirect-msg">
              Redirecting to main screen...
            </div>
          )}
        </>
      ) : (
        <>
          <label>Operator Scan Code</label>
          <input
            type="text"
            placeholder="Scan Code"
            value={scanCode}
            onChange={e => setScanCode(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="primary-button" onClick={handleLogin}>Login</button>
          <button className="primary-button" onClick={handleBack}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {selectedUser && (
        <div className="confirmation-popup">
          <h3>Confirm Operator</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Scan Code:</strong> {selectedUser.scanCode}</p>
          <div className="confirmation-buttons">
            <button className="primary-button" onClick={handleConfirm}>OK</button>
            <button className="red-button" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
