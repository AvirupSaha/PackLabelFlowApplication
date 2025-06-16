import React, { useEffect, useState } from 'react';
import './CleanRoom.css';
import { useNavigate } from 'react-router-dom';

const CleanRoom = () => {
  const navigate = useNavigate();

  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [error, setError] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
    const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
    const roomAllocated = localStorage.getItem('roomAllocated') === 'true';
    setEnabled(operatorLoggedIn && jobAllocated && roomAllocated);
  }, []);

  const handleCleanRoomClick = () => {
    setShowCredentialForm(true);
    setError('');
  };

  const handleCancel = () => {
    setShowCredentialForm(false);
    setScanCodeInput('');
    setOperatorPassword('');
    setError('');
  };

  const handleValidateCredentials = () => {
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(data => {
        const matchedOperator = data.find(
          op => op.scanCode === scanCodeInput && op.password === operatorPassword
        );

        if (matchedOperator) {
          navigate('/pex/clean-room-process', {
            state: { operator: matchedOperator }
          });
        } else {
          setError('Invalid Credentials!');
        }
      })
      .catch(err => {
        console.error('Error loading operator.json:', err);
        setError('Failed to validate credentials');
      });
  };

  return (
    <div>
      <button
        className="primary-button"
        onClick={handleCleanRoomClick}
        disabled={!enabled}
        title={
          enabled
            ? ''
            : 'Complete Operator Login, Job Allocation, and Room Allocation first.'
        }
      >
        Clean Room
      </button>

      <div className="clean-room">
        {showCredentialForm && (
          <div className="popup">
            <label>Operator Scan Code</label>
            <input
              type="text"
              placeholder="Scan Code"
              className="inputclean"
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              className="inputclean"
              value={operatorPassword}
              onChange={(e) => setOperatorPassword(e.target.value)}
            />
            <button onClick={handleValidateCredentials}>Proceed</button>
            <button onClick={handleCancel}>Cancel</button>
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanRoom;
