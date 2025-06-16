import React, { useEffect, useState } from 'react';
import './Equipment.css';
import { useNavigate } from 'react-router-dom';

const Equipment = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
    const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
     const roomAllocated = localStorage.getItem('roomAllocated') === 'true';
    setEnabled(operatorLoggedIn && jobAllocated&&roomAllocated);
  }, []);

  const handleClick = () => {
    if (enabled) {
      navigate('/pex/equipmentregistration');
    }
  };

  return (
    <div className="operator">
      <button
        className="primary-button"
        onClick={handleClick}
        disabled={!enabled}
        title={enabled ? '' : 'Login, allocate job and room to enable'}
      >
        Equipment
      </button>
    </div>
  );
};

export default Equipment;
