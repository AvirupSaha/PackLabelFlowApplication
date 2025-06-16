import React, { useState } from 'react';
import './RestartApplication.css';
import { useNavigate } from 'react-router-dom';

const RestartApplication = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRestartClick = () => {
    setShowConfirm(true);
  };

  const handleYes = () => {
      document.cookie.split(';').forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    navigate('/pex/restart');
  };

  const handleNo = () => {
    setShowConfirm(false);
  };

  return (
    <div className="packaging">
      {!showConfirm && (
        <button className="red-button" onClick={handleRestartClick}>
          Restart Application
        </button>
      )}
      {showConfirm && (
        <div className="confirm-box">
          <p>Are you sure you want to restart the Application?</p>
          <div className='confirm-box-button'>
            <button className="primary-button" onClick={handleYes}>Yes</button>
          <button className="primary-button" onClick={handleNo}>No</button>
        </div>
        </div>
      )}
    </div>
  );
};

export default RestartApplication;
