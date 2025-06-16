import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { lazy, useState, useEffect } from 'react';

import PexLogin from './PexLogin/PexLogin';
import PexMainPage from './PexMainPage/PexMainPage';
import Operator from './PexMainPage/RightPanel/Operator/OperatorLogin';
import Reconciliation from './PexMainPage/RightPanel/Reconciliation/Reconciliationprocess';
import ManageSu from './PexMainPage/LeftPanel/ManageSu/ManageSu';
import Checklists from './PexMainPage/RightPanel/Checklists/Checklistsprocess';
import OtherInfo from './PexMainPage/TopPanel/OtherInfo/OtherInfo';
import RoomAllocationProcess from './PexMainPage/LeftPanel/RoomAllocation/RoomAllocationProcess';
import { RoomProvider } from './PexMainPage/LeftPanel/RoomAllocation/Roomcontext';
import RestartApplication from './PexMainPage/CenterPanel/RestartApplication/RestartApplication';
import CleanRoomProcess from './PexMainPage/LeftPanel/CleanRoom/CleanRoomProcess';
import Equipment from './PexMainPage/RightPanel/Equipment/Equipment';
import CloseSu from './PexMainPage/LeftPanel/ManageSu/CloseSu';
import ManageSuProcess from './PexMainPage/LeftPanel/ManageSu/ManageSuProcess';
import OpenSu from './PexMainPage/LeftPanel/ManageSu/OpenSu';
import LabelSu from './PexMainPage/LeftPanel/ManageSu/LabelSu';
import EndJobProcess from './PexMainPage/RightPanel/EndJob/EndJobProcess';
import { JobProvider } from './PexMainPage/LeftPanel/JobAllocation/Jobcontext';
import JobAllocationProcess from './PexMainPage/LeftPanel/JobAllocation/JobAllocationProcess';
import Sop from './PexMainPage/LeftPanel/SOP/Sop';
import SopDocument from './PexMainPage/LeftPanel/SOP/SopDocument';
import SopDocumentCredits from './PexMainPage/LeftPanel/SOP/SopDocumentCredit';
import Footer from './Footer/Footer';

const Packaging = lazy(() => import('./PexMainPage/CenterPanel/Packaging/Packaging'));
const Packagingprocess = lazy(() => import('./PexMainPage/CenterPanel/Packaging/Packagingprocess'));
const ChecklistsProcess = lazy(() => import('./PexMainPage/RightPanel/Checklists/Checklistsprocess'));
const RestartApplicationProcess = lazy(() => import('./PexMainPage/CenterPanel/RestartApplication/RestartApplicationProcess'));
const Reconciliationprocess = lazy(() =>
  import('./PexMainPage/RightPanel/Reconciliation/Reconciliationprocess')
);
const EquipmentRegistration = lazy(() =>
  import('./PexMainPage/RightPanel/Equipment/EquipmentRegistration')
);

const DelayedSuspense = ({ children }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  return show ? children : <div className="loader">Loading...</div>;
};

function App() {
  return (
    <div className="app-container">
      <JobProvider>
      <RoomProvider>
        <Router>
          <Routes>
            <Route path="/" element={<PexLogin />} />
            <Route path="/login" element={<PexLogin />} />
            <Route path="/pex" element={<PexMainPage />} />
            <Route path="/pex/operatorlogin" element={<Operator />} />
            <Route path="/pex/equipmentregistration" element={<EquipmentRegistration />} />
            <Route path="/pex/reconcileprocess" element={<Reconciliation />} />
            <Route path="/pex/managesu" element={<ManageSu />} />
            <Route path="/pex/checklists" element={<Checklists />} />
            <Route path="/pex/otherinfo" element={<OtherInfo />} />
            <Route path="/pex/room-allocationprocess" element={<RoomAllocationProcess />} />
             <Route path="/pex/job-allocationprocess" element={<JobAllocationProcess />} />
            <Route path="/pex/clean-room-process" element={<CleanRoomProcess />} />
            <Route path="/pex/restartapplication" element={<RestartApplication />} />
<Route path="/sop" element={<Sop/>} />
<Route path="/sopdocument" element={<SopDocument/>} />
<Route path="/sopdocumentcredit" element={<SopDocumentCredits/>} />

            <Route path="/manage-su" element={<ManageSu />} />
            <Route path="/manage-su/open" element={<OpenSu />} />
            <Route path="/manage-su/label" element={<LabelSu />} />
            <Route path="/manage-su/close" element={<CloseSu />} />
            <Route path="/manage-su/process" element={<ManageSuProcess />} />
            <Route path='/manage-su/manage-su-process'  element={<ManageSuProcess />}/>
<Route path="/pex/endjobprocess" element={<EndJobProcess />} />
            <Route path="/pex/packaging" element={
              <DelayedSuspense>
                <Packaging />
              </DelayedSuspense>
            } />

            <Route path="/pex/equipmentregistration" element={
              <DelayedSuspense>
                <EquipmentRegistration />
              </DelayedSuspense>
            } />

            <Route path="/pex/packagingprocess" element={
              <DelayedSuspense>
                <Packagingprocess />
              </DelayedSuspense>
            } />

            <Route path="/pex/checklistsprocess" element={
              <DelayedSuspense>
                <ChecklistsProcess />
              </DelayedSuspense>
            } />

            <Route path="/pex/equipment" element={
              <DelayedSuspense>
                <Equipment />
              </DelayedSuspense>
            } />
            <Route path="/pex/equipmentregistration" element={
              <DelayedSuspense>
                <EquipmentRegistration />
              </DelayedSuspense>
            } />

            <Route path="/pex/restart" element={
              <DelayedSuspense>
                <RestartApplicationProcess />
              </DelayedSuspense>
            } />

            <Route path="/pex/reconcileprocess" element={
              <DelayedSuspense>
                <Reconciliationprocess />
              </DelayedSuspense>
            } />
          </Routes>
        </Router>
      </RoomProvider>
      </JobProvider>
      <Footer />
    </div>
  );
}

export default App;
