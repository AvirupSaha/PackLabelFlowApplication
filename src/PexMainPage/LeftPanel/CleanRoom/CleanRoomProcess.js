import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoom } from '../RoomAllocation/Roomcontext';
import './CleanRoom.css';  

const CleanRoomProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAllocatedRoom } = useRoom();
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    if (!location.state || !location.state.operator) {
      navigate('/pex/cleanroom');
    } else {
      console.log('Cleaning room for:', location.state.operator.name);
      setAllocatedRoom(null);
      

      setTimeout(() => {
        setLoading(false);  
        navigate('/pex');
      }, 5000);
    }
  }, [location.state, navigate, setAllocatedRoom]);

  return (
    <div className="cleanroomprocess">
      <h2>Cleaning Room...</h2>
      <p>Please wait while Application is cleaning the room.</p>
      {loading && <div className="spinner2"></div>}  
    </div>
  );
};

export default CleanRoomProcess;
