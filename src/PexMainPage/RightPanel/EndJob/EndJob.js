import React, { useEffect, useState } from 'react';
import './EndJob.css';
import { useNavigate } from 'react-router-dom';

const EndJob = () => {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [hasReason, setHasReason] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPercent(parseFloat(localStorage.getItem('reconciliationPercent')) || 0);
    setHasReason(!!localStorage.getItem('reconciliationReasonKey'));
  }, []);

  const canEnd = percent === 100 || hasReason;

  const handleEnd = () => {
    if (!canEnd) {
      setError('Cannot end job — must be 100% or a saved reason is required.');
      return;
    }
    setError('');
    setShowConfirm(true);
  };

  const handleYes = () => {
    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .trim()
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    navigate('/pex/endjobprocess');
  };

  const handleNo = () => setShowConfirm(false);

  return (
    <div className="packaging">
      {error && <p className="error">{error}</p>}
      {!showConfirm ? (
        <button
          className={`primary-button ${!canEnd ? 'disabled' : ''}`}
          onClick={handleEnd}
          disabled={!canEnd}
        >
          End Job
        </button>
      ) : (
        <div className="confirm-box">
          <p>End the job?</p>
          <div className="confirm-box-button">
            <button className="primary-button" onClick={handleYes}>Yes</button>
            <button className="primary-button" onClick={handleNo}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndJob;
