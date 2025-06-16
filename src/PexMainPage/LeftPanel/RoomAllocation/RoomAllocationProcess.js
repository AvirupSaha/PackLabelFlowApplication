import React, { useEffect, useState } from 'react';
import './RoomAllocation.css';
import { useNavigate } from 'react-router-dom';
import { useRoom } from './Roomcontext';

const RoomAllocationProcess = () => {
  const navigate = useNavigate();
  const { setAllocatedRoom } = useRoom();

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [credentialsShown, setCredentialsShown] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('/DB_records/Room.json')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Failed to load room data:", err));
  }, []);

  const handleAllocate = () => {
    if (selectedRoom) {
      setConfirming(true);
    }
  };

  const handleConfirmYes = () => {
    setConfirming(false);
    setCredentialsShown(true);
  };

  const handleConfirmNo = () => {
    setConfirming(false);
  };

  const handleCancel = () => {
    navigate('/pex');
  };

  const handleValidateCredentials = () => {
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(data => {
        const matchedOperator = data.find(
          op => op.scanCode === scanCodeInput && op.password === operatorPassword
        );

        if (matchedOperator) {
          setAllocatedRoom(selectedRoom);
          localStorage.setItem('roomAllocated', 'true'); 
          setSuccessMessage(`Room ${selectedRoom} successfully allocated!`);
          setCredentialsShown(false);
          setError('');

          setTimeout(() => {
            setSuccessMessage('');
            navigate('/pex', {
              state: { operator: matchedOperator, room: selectedRoom }
            });
          }, 7000);
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
    <div className="roomallocationprocess">
      {!confirming && !credentialsShown && !successMessage && (
        <>
          <h3>Select a Room to Allocate</h3>
          <select onChange={(e) => setSelectedRoom(e.target.value)} defaultValue="">
            <option value="" disabled>Select Room</option>
            {rooms.map((room) => (
              <option key={room.room} value={room.room}>
                Room {room.room}
              </option>
            ))}
          </select>
          <div className='button-okcancel'>
            <button onClick={handleAllocate} disabled={!selectedRoom} className='primary-button'>
              Okay
            </button>
            <button onClick={handleCancel} className='primary-button'>
              Cancel
            </button>
          </div>
        </>
      )}

      {confirming && (
        <div className="popup-rmal1">
          <p>Do you want to allocate <strong>Room {selectedRoom}</strong>?</p>
          <button className="primary-button" onClick={handleConfirmYes}>Yes</button>
          <button className="primary-button" onClick={handleConfirmNo}>No</button>
        </div>
      )}

      {credentialsShown && (
        <div className="popup-rmal1">
          <p><b>Enter Operator Credentials to Allocate Room</b></p>
          Scan Code
          <input
            type="text"
            placeholder="Scan Code"
            className="inputclean-rmal1"
            value={scanCodeInput}
            onChange={(e) => setScanCodeInput(e.target.value)}
          />
          Password
          <input
            type="password"
            placeholder="Password"
            className="inputclean-rmal1"
            value={operatorPassword}
            onChange={(e) => setOperatorPassword(e.target.value)}
          />
          <button className="primary-button" onClick={handleValidateCredentials}>Proceed</button>
          <button className="primary-button" onClick={handleCancel}>Cancel</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {successMessage && (
        <div className="popup-success-rap">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RoomAllocationProcess;
