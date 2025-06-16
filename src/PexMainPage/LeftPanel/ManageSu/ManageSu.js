import React, { useEffect, useState } from 'react';
import './ManageSu.css';
import { useNavigate } from 'react-router-dom';

const ManageSu = ({ showSUOptions, setShowSUOptions }) => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
     const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
     const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
      const roomAllocated = localStorage.getItem('roomAllocated') === 'true';
       const equipmentRegistered = localStorage.getItem('equipmentRegistered') === 'true';
        const checklistCompleted = localStorage.getItem('checklistCompleted') === 'true';
     setEnabled(operatorLoggedIn && jobAllocated&&roomAllocated&&equipmentRegistered&&checklistCompleted);
   }, []);

  return (
    <div className="manage-su">
      <button
        className="primary-button"
        onClick={() => enabled && setShowSUOptions(!showSUOptions)}
        disabled={!enabled}
        title={enabled ? '' : 'Please complete: Operator login, Job allocation, Room allocation, Equipment registration, and Checklist completion'}
      >
        Manage SU
      </button>

      {enabled && showSUOptions && (
        <div className="nested-buttons">
          <button className="primary-button" onClick={() => navigate('/manage-su/open')}>
            Open SU
          </button>
          <button className="primary-button" onClick={() => navigate('/manage-su/label')}>
            Label SU
          </button>
          <button className="primary-button" onClick={() => navigate('/manage-su/close')}>
            Close SU
          </button>
          <button className="primary-button" onClick={() => navigate('/manage-su/empty')}>
            Empty SU
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageSu;
