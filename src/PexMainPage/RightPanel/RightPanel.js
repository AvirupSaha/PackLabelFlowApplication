import React from 'react';
import Checklists from './Checklists/Checklists';
import EndJob from './EndJob/EndJob';
import Equipment from './Equipment/Equipment';
import Operator from './Operator/Operator';
import Reconciliation from './Reconciliation/Reconciliation';

const RightPanel = () => (
  <div className="sidebar">
    <Operator />
    <Equipment />
    <Checklists />
    <Reconciliation />
    <EndJob />
  </div>
);

export default RightPanel;
