import React, { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("pex-session");
    return stored
      ? JSON.parse(stored)
      : {
          operatorId: null,
          roomId: null,
          equipmentId: null,
          checklistStatus: false,
          packagingStatus: false,
          reconciliationStatus: false,
          cleanRoomStatus: false,
          currentStep: "login",
        };
  });

  useEffect(() => {
    localStorage.setItem("pex-session", JSON.stringify(session));
  }, [session]);

  // Update session with partial changes
  const updateSession = (updates) => {
    setSession((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetSession = () => {
    setSession({
      operatorId: null,
      roomId: null,
      equipmentId: null,
      checklistStatus: false,
      packagingStatus: false,
      reconciliationStatus: false,
      cleanRoomStatus: false,
      currentStep: "login",
    });
    localStorage.removeItem("pex-session");
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
};


export const useSession = () => {
  return useContext(SessionContext);
};
