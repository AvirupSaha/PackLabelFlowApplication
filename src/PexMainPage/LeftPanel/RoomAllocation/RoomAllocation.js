import React, { useEffect, useState } from 'react';
import './RoomAllocation.css';
import { useNavigate } from 'react-router-dom';

const RoomAllocation = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
    const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
    setEnabled(operatorLoggedIn && jobAllocated);
  }, []);

  return (
    <div className="operator">
      <button
        className="primary-button"
        onClick={() => enabled && navigate('/pex/room-allocationprocess')}
        disabled={!enabled}
        title={enabled ? '' : 'Login and allocate job to enable'}
      >
        Room Allocation
      </button>
    </div>
  );
};

export default RoomAllocation;
