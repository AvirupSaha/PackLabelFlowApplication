import React, { useEffect, useState } from 'react';
import './JobAllocation.css';
import { useNavigate } from 'react-router-dom';

const JobAllocation = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem('operatorLoggedIn') === 'true');
  }, []);

  return (
    <div className="joballocate">
      <button
        className="primary-button"
        onClick={() => enabled && navigate('/pex/job-allocationprocess')}
        disabled={!enabled}
        title={enabled ? '' : 'Login as operator to enable'}
      >
        Job Allocation
      </button>
    </div>
  );
};

export default JobAllocation;