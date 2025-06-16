import React from 'react';
import RoomAllocation from './RoomAllocation/RoomAllocation';
import CleanRoom from './CleanRoom/CleanRoom';
import ManageSu from './ManageSu/ManageSu';
import './LeftPanel.css';
import JobAllocation from './JobAllocation/JobAllocation';
import Sop from './SOP/Sop'

const LeftPanel = ({ showSUOptions, setShowSUOptions }) => (
  <div className="sidebar left">
    <JobAllocation />
    <RoomAllocation />
    <CleanRoom />
    <Sop/>
    <ManageSu showSUOptions={showSUOptions} setShowSUOptions={setShowSUOptions} />
  </div>
);

export default LeftPanel;