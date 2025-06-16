import React, { createContext, useContext, useEffect, useState } from 'react';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [allocatedRoom, setAllocatedRoomState] = useState(() => {
    return localStorage.getItem('allocatedRoom') || null;
  });

  useEffect(() => {
    localStorage.setItem('allocatedRoom', allocatedRoom);
  }, [allocatedRoom]);
  

  const setAllocatedRoom = (room) => {
    setAllocatedRoomState(room);
  };

  return (
    <RoomContext.Provider value={{ allocatedRoom, setAllocatedRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
