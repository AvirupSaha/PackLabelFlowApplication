import React, { useEffect, useState } from 'react';
import './RestartApplication.css';
import { useNavigate, useLocation } from 'react-router-dom';

const RestartApplicationProcess = () => {
  const [status, setStatus] = useState('restarting');
  const navigate = useNavigate();
  const location = useLocation();

  const isShutdown = location.state?.type === 'shutdown';

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isShutdown) {
        navigate('/'); 
      } else {
        fetch('/pex', { method: 'HEAD' })
          .then((res) => {
            if (res.ok) {
              navigate('/pex');
            } else {
              setStatus('unreachable');
            }
          })
          .catch(() => {
            setStatus('unreachable');
          });
      }
    }, 7000);

    return () => clearTimeout(timeout);
  }, [navigate, isShutdown]);

  return (
    <div className="restart-container">
      {status === 'restarting' && (
        <>
          <div className="spinner"></div>
          <div className="relaod-text">
            {isShutdown
              ? 'Shutting down Application, please wait...'
              : 'Restarting Application, please wait...'}
          </div>
        </>
      )}
      {status === 'unreachable' && !isShutdown && (
        <p className="error-text">
          Application not reachable after restart. Please try again later.
        </p>
      )}
    </div>
  );
};

export default RestartApplicationProcess;
