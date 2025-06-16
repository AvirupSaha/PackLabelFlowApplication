import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EndJobProcess = () => {
const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {

      navigate('/pex', { replace: true });
      window.location.reload();
    }, 1000);


    return () => clearTimeout(delay);
  }, [navigate]);
  return (
    <div className="loading-screen">
      <h2>Ending the ongoing job...</h2>
      <p>It may take some time. Please wait.</p>
      <div className="spinner1" />
    </div>
  );
};

export default EndJobProcess;
