import React from 'react';
import Packaging from './Packaging/Packaging';
import RestartApplication from './RestartApplication/RestartApplication';
import Shutdown from './Shutdown/Shutdown';

const CenterPanel = () => (
  <div className="center-panel">
    <Packaging />
    <RestartApplication />
    <Shutdown />
  </div>
);

export default CenterPanel;