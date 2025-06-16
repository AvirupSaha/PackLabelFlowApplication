import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [allocatedJob, setAllocatedJob] = useState('');
  const [allocatedOrder, setAllocatedOrder] = useState('');

  return (
    <JobContext.Provider value={{ allocatedJob, setAllocatedJob, allocatedOrder, setAllocatedOrder }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);
