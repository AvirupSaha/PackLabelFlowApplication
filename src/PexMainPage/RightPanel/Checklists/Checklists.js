import React, { useEffect, useState } from 'react';
import './Checklists.css';
import { useNavigate } from 'react-router-dom';

const Checklists = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
    const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
    const roomAllocated = localStorage.getItem('roomAllocated') === 'true';
    const equipmentRegistered = localStorage.getItem('equipmentRegistered') === 'true';
    const checklistDone = localStorage.getItem('checklistCompleted') === 'true';

    setAlreadyCompleted(checklistDone);
    setEnabled(operatorLoggedIn && jobAllocated && roomAllocated && equipmentRegistered);
  }, []);

  return (
    <div className="operator">
      <button
        className="primary-button"
        onClick={() => enabled && navigate('/pex/checklistsprocess')}
        disabled={!enabled}
        title={enabled ? '' : 'Login, allocate job, room and register equipment to enable Checklists'}
      >
        {alreadyCompleted ? 'Checklists' : 'Checklists'}
      </button>
    </div>
  );
};

export default Checklists;
