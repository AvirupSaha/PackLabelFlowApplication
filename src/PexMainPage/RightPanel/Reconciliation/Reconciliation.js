import React, { useEffect, useState } from 'react';
import './Reconciliation.css';
import { useNavigate } from 'react-router-dom';

const Reconciliation = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const checkPrerequisites = () => {
      const operatorLoggedIn = localStorage.getItem('operatorLoggedIn') === 'true';
      const jobAllocated = localStorage.getItem('jobAllocated') === 'true';
      const roomAllocated = localStorage.getItem('roomAllocated') === 'true';
      const equipmentRegistered = localStorage.getItem('equipmentRegistered') === 'true';
      const checklistCompleted = localStorage.getItem('checklistCompleted') === 'true';
      const packagingCompleted = localStorage.getItem('packagingCompleted') === 'true';
      const closedSUCompleted = localStorage.getItem('closedSUCompleted') === 'true'; // ✅ NEW

      setEnabled(
        operatorLoggedIn &&
        jobAllocated &&
        roomAllocated &&
        equipmentRegistered &&
        checklistCompleted &&
        packagingCompleted &&
        closedSUCompleted 
      );
    };

    checkPrerequisites();

    const handleStorageChange = () => checkPrerequisites();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="operator">
      <button
        className="primary-button"
        onClick={() => enabled && navigate('/pex/reconcileprocess')}
        disabled={!enabled}
        title={
          enabled
            ? ''
            : 'Please complete: Operator login, Job allocation, Room allocation, Equipment registration, Checklist, Packaging, and SU Closure'
        }
      >
        Reconciliation
      </button>
    </div>
  );
};

export default Reconciliation;
