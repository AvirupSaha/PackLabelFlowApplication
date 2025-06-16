import React, { useState } from 'react';
import LeftPanel from './LeftPanel/LeftPanel';
import TopPanel from './TopPanel/TopPanel';
import RightPanel from './RightPanel/RightPanel';
import CenterPanel from './CenterPanel/CenterPanel';

const PexMainPage = () => {
  const [showSUOptions, setShowSUOptions] = useState(false);

  return (
    <div className='app-container'>
      <TopPanel />
      <div className="main-content">
        <LeftPanel showSUOptions={showSUOptions} setShowSUOptions={setShowSUOptions} />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
};

export default PexMainPage;
