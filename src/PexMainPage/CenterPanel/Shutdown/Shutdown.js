import React, { useState } from 'react';
import './Shutdown.css';
import { useNavigate } from 'react-router-dom';

const Shutdown = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleShutdownClick = () => {
    setShowConfirm(true);
  };

  const handleYes = () => {
    // Remove specific localStorage/sessionStorage items
    localStorage.removeItem('allocatedJob');
    localStorage.removeItem('allocatedRoom');
    localStorage.removeItem('allocatedEquipment');
    localStorage.removeItem('scannedInputSUs');
    localStorage.removeItem('scannedOutputSU');
    localStorage.removeItem('packagingDone');
    localStorage.removeItem('reconciliationDone');
    localStorage.removeItem('cleaningDone');
    localStorage.removeItem('operatorSession');
    localStorage.removeItem('progressSession');

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });

    navigate('/pex/restart', { state: { type: 'shutdown' } });
  };

  const handleNo = () => {
    setShowConfirm(false);
  };

  return (
    <div className="packaging">
      {!showConfirm && (
        <button className="red-button" onClick={handleShutdownClick}>
          Shutdown
        </button>
      )}
      {showConfirm && (
        <div className="confirm-box">
          <p>Are you sure you want to shutdown the Application?</p>
          <div className="confirm-box-button">
            <button className="primary-button" onClick={handleYes}>Yes</button>
            <button className="primary-button" onClick={handleNo}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shutdown;
