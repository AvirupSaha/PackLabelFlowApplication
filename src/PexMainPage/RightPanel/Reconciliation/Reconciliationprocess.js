import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reconciliation.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const reasonOptions = [
  { key: 'SHORTAGE', label: 'Inefficient quantity' },
  { key: 'DAMAGED', label: 'Broken storage units' },
  { key: 'EXCESS', label: 'Excess quantity used up' },
  { key: 'OTHER', label: 'Other' },
];

const Reconciliationprocess = () => {
  const navigate = useNavigate();

  const [details, setDetails] = useState({ qIn: 0, qOut: 0, qSample: 0, qScrap: 0, qRest: 0, qActions: 0 });
  const [reconciliationPercent, setReconciliationPercent] = useState(0);
  const [reasonKey, setReasonKey] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showIPCForm, setShowIPCForm] = useState(false);
  const [operators, setOperators] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [existingIPCReason, setExistingIPCReason] = useState(null);
  const [adjustedQty, setAdjustedQty] = useState(0);

  useEffect(() => {
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(setOperators)
      .catch(err => console.error('Failed to load operator list', err));

    fetch('/DB_records/Supervisor.json')
      .then(res => res.json())
      .then(setSupervisors)
      .catch(err => console.error('Failed to load supervisor list', err));
  }, []);

  useEffect(() => {
    const closedSUData = JSON.parse(localStorage.getItem('closedSUData')) || {};
    const inputSUs = closedSUData.inputs || [];
    const outputSUs = closedSUData.outputs || [];

    const sum = arr => arr.reduce((s, e) => s + (Number(e.quantity || e.openQty || e.restQty) || 0), 0);
    const inputQty = sum(inputSUs.map(u => ({ openQty: u.openQty })));
    const restQty = sum(inputSUs.map(u => ({ restQty: u.restQty })));
    const outputQty = sum(outputSUs.filter(u => u.type === 'Output'));
    const sampleQty = closedSUData.sample?.quantity || 0;
    const scrapQty = closedSUData.scrap?.quantity || 0;

    const qActions = outputQty;
    const usedQty = inputQty - restQty;
    const totalAccountedQty = qActions + sampleQty + scrapQty;
    const adjusted = usedQty - totalAccountedQty;

    const percent = usedQty ? (totalAccountedQty / usedQty) * 100 : 0;
    const rounded = parseFloat(percent.toFixed(2));

    setReconciliationPercent(rounded);
    setDetails({ qIn: inputQty, qOut: outputQty, qSample: sampleQty, qScrap: scrapQty, qRest: restQty, qActions });
    setAdjustedQty(adjusted);

    localStorage.setItem('reconciliationPercent', String(rounded));
    localStorage.setItem('reconciliationDone', (rounded === 100).toString());

    const savedReason = localStorage.getItem('reconciliationReason');
    const savedScan = localStorage.getItem('reconciliationScanCode');
    const savedName = localStorage.getItem('reconciliationName');
    if (savedReason && savedScan && savedName) {
      setExistingIPCReason({ reason: savedReason, scanCode: savedScan, name: savedName });
    }
  }, []);

  const handleIPCClick = () => {
    setShowIPCForm(true);
  };

  const handleBack = () => {
    navigate('/pex');
  };

  const handleConfirm = () => {
    setError('');

    if (!reasonKey || !scanCode || !password || (reasonKey === 'OTHER' && !customReason.trim())) {
      setError('All fields are required.');
      return;
    }

    const isOperator = operators.some(op => op.scanCode === scanCode && op.password === password);
    if (isOperator) {
      setError('IPC reason should be given by supervisor, not operator.');
      return;
    }

    const supervisor = supervisors.find(sup => sup.scanCode === scanCode && sup.password === password);
    if (!supervisor) {
      setError('Please register with supervisor ID.');
      return;
    }

    let reasonLabel = reasonOptions.find(o => o.key === reasonKey)?.label || '';
    if (reasonKey === 'OTHER') {
      reasonLabel = customReason.trim();
    }

    localStorage.setItem('reconciliationReasonKey', reasonKey);
    localStorage.setItem('reconciliationReason', reasonLabel);
    localStorage.setItem('reconciliationScanCode', scanCode);
    localStorage.setItem('reconciliationName', supervisor.name);

    toast.success('Reconciliation status updated.');
    setExistingIPCReason({ reason: reasonLabel, scanCode, name: supervisor.name });
    setShowIPCForm(false);
  };

  return (
    <div className='reconwrapper'>
      <div className="reconciliationprocess">
        <h2>Reconciliation Summary</h2>
        <button className='primary-button' onClick={handleBack}>Back</button>

        <table className="reconciliation-metrics">
          <thead>
            <tr>
              <th>Total Input Quantity</th>
              <th>Output Qty (Packaged)</th>
              <th>Sample Qty</th>
              <th>Scrap Qty</th>
              <th>Rest Qty</th>
              <th>Reconciliation %</th>
              <th>IPC Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{details.qIn}</td>
              <td>{details.qActions}</td>
              <td>{details.qSample}</td>
              <td>{details.qScrap}</td>
              <td>{details.qRest}</td>
              <td>{reconciliationPercent}%</td>
              <td>
                {reconciliationPercent !== 100 ? (
                  existingIPCReason ? (
                    <div className="ipc-display">
                      <div><strong>Reason:</strong> {existingIPCReason.reason}</div>
                      <div><strong>Supervisor ID:</strong> {existingIPCReason.scanCode}</div>
                      <div><strong>Supervisor Name:</strong> {existingIPCReason.name}</div>
                      <div><strong>Qty Adjusted:</strong> {adjustedQty}</div>
                    </div>
                  ) : (
                    <button className='ipc-reason' onClick={handleIPCClick}>+</button>
                  )
                ) : "-"}
              </td>
            </tr>
          </tbody>
        </table>

        {reconciliationPercent !== 100 && adjustedQty > 0 && (
          <div className="adjust-warning">
            <p><strong>To reach 100% reconciliation, account for:</strong> {adjustedQty} unit(s)</p>
          </div>
        )}

        {showIPCForm && (
          <div className="operator-login-recon">
            <label>Reason for mismatch:</label>
            <select value={reasonKey} onChange={e => {
              setReasonKey(e.target.value);
              if (e.target.value !== 'OTHER') setCustomReason('');
            }}>
              <option value="">Select Reason</option>
              {reasonOptions.map(o => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>

            {reasonKey === 'OTHER' && (
              <>
                <label>Custom Reason:</label>
                <input
                  type="text"
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Enter custom reason"
                />
              </>
            )}

            <label>Supervisor Scan Code:</label>
            <input type="text" value={scanCode} onChange={e => setScanCode(e.target.value)} />

            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

            {error && <p className="error">{error}</p>}

            <div className="confirmation-buttons">
              <button className="primary-button" onClick={handleConfirm}>OK</button>
            </div>
          </div>
        )}

        <ToastContainer autoClose={5000} position="top-center" />
      </div>
    </div>
  );
};

export default Reconciliationprocess;
