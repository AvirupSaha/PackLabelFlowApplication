import React, { useState, useEffect } from 'react';
import './Packaging.css';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../../LeftPanel/RoomAllocation/Roomcontext';

const Packaging = () => {
  const navigate = useNavigate();
  const { allocatedRoom } = useRoom();
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [error, setError] = useState('');
  const [orderQty, setOrderQty] = useState(0);
  const [isPackagingCompleted, setIsPackagingCompleted] = useState(false);

  useEffect(() => {
    const job = JSON.parse(localStorage.getItem('currentJob')) || null;
    if (job && job.orderQty) setOrderQty(job.orderQty);

    const packagingStatus = localStorage.getItem('packagingCompleted');
    if (packagingStatus === 'true') {
      setIsPackagingCompleted(true);
    }
  }, []);

  const handlePackagingClick = () => {
    if (isPackagingCompleted) {
      setError('Packaging is already completed!');
      return;
    }

    const storedEquipments = JSON.parse(localStorage.getItem('registeredEquipments')) || [];
    const suConfirmed = localStorage.getItem('suSessionStatus') === 'confirmed';

    if (!suConfirmed) {
      setError('Please open SU or scan SU before starting packaging!');
      return;
    }

    if (!allocatedRoom || storedEquipments.length === 0) {
      setError('Please assign correct room to proceed with packaging!');
      return;
    }

    fetch('/DB_records/Room.json')
      .then(res => res.json())
      .then(data => {
        const roomMatch = data.find(item => item.room === allocatedRoom);
        const manualPack = storedEquipments.find(item => item.equipment_type === 'Manual Pack');
        const manualPackCode = manualPack?.equipment_scan_code || '';
        const packRoomSuffix = manualPackCode.replace('MP', '');

        if (roomMatch && roomMatch.room === packRoomSuffix) {
          setShowCredentialForm(true);
          setError('');
        } else {
          setError('Please assign correct room to proceed with packaging!');
        }
      })
      .catch(err => {
        console.error('Failed to load room info:', err);
        setError('Error validating room info!');
      });
  };

  const handleCancel = () => {
    setShowCredentialForm(false);
    setScanCodeInput('');
    setOperatorPassword('');
    setError('');
  };

  const handleValidateCredentials = () => {
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(data => {
        const matchedOperator = data.find(
          op => op.scanCode === scanCodeInput && op.password === operatorPassword
        );

        if (matchedOperator) {
          navigate('/pex/packagingprocess', {
            state: {
              operator: matchedOperator,
              orderQty: orderQty
            }
          });
        } else {
          setError('Invalid Credentials!');
        }
      })
      .catch(err => {
        console.error('Error loading operator.json:', err);
        setError('Failed to validate credentials');
      });
  };

  return (
    <>
      <div className='blinking-message'>
        {error && <p className="error">{error}</p>}
      </div>
      <div className="packagingbtn">
        {!showCredentialForm && (
          <button
            className="primary-button"
            onClick={handlePackagingClick}
          >
            Packaging
          </button>
        )}

        {showCredentialForm && (
          <div className="popupmsg">
            <p>Enter Operator Credentials</p>
            <div>Scan Code</div>
            <input
              type="text"
              placeholder="Scan Code"
              className="inputcleanbtn"
              value={scanCodeInput}
              onChange={(e) => setScanCodeInput(e.target.value)}
            />
            <div>Password</div>
            <input
              type="password"
              placeholder="Password"
              className="inputcleanbtn"
              value={operatorPassword}
              onChange={(e) => setOperatorPassword(e.target.value)}
            />
            <button className="primary-button" onClick={handleValidateCredentials}>Proceed</button>
            <button className="primary-button" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Packaging;
