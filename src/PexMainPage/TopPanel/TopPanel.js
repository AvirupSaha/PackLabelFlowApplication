import React, { useEffect, useState } from 'react';
import OtherInfo from './OtherInfo/OtherInfo';
import ProgressBar from './ProgressBar/ProgressBar';

const TopPanel = () => {
  const [progressData, setProgressData] = useState({
    current: 0,
    total: 0,
  });

  useEffect(() => {
    const updateProgress = () => {
      const session = JSON.parse(localStorage.getItem('progressSession'));
      if (session) {
        setProgressData({
          current: session.current || 0,
          total: session.total || 0,
        });
      }
    };

    updateProgress(); 
    const interval = setInterval(updateProgress, 500); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="top-panel">
      <OtherInfo />
      <ProgressBar
        current={progressData.current}
        total={progressData.total}
      />
    </div>
  );
};

export default TopPanel;
