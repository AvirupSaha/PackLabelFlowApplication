import { useState, useEffect, useContext, createContext } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    operator: "",
    currentStep: "login",
    roomId: null,
    // add other fields as needed
  });

  useEffect(() => {
    const saved = localStorage.getItem("pex-session");
    if (saved) {
      setSession(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pex-session", JSON.stringify(session));
  }, [session]);

  const updateSession = (updates) => {
    setSession((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SessionContext.Provider value={{ session, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
