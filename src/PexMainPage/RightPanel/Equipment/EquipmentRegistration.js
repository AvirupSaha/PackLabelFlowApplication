import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Equipment.css';
import TopPanel from '../../TopPanel/TopPanel';

const EquipmentRegistration = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [scanInput, setScanInput] = useState('');
  const [scannedEquipment, setScannedEquipment] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const jobDetails = JSON.parse(localStorage.getItem('allocatedJobDetails'));
  const expectedPrinterType = jobDetails?.printertype?.trim().toLowerCase();

  useEffect(() => {
    fetch('/DB_records/Equipment.json')
      .then((res) => res.json())
      .then(setEquipmentList)
      .catch((err) => console.error('Error loading equipment:', err));

    const storedEquipments = localStorage.getItem('registeredEquipments');
    if (storedEquipments) {
      try {
        const parsed = JSON.parse(storedEquipments);
        if (Array.isArray(parsed)) {
          setScannedEquipment(parsed);
          setMessage({ type: 'info', text: 'Previously registered equipment loaded. You can update it.' });
        }
      } catch (err) {
        console.error('Error parsing stored equipment:', err);
      }
    }
  }, []);

  const handleScan = (e) => {
    if (e.key === 'Enter') {
      const input = scanInput.trim().toUpperCase();
      const found = equipmentList.find(eq => eq.equipment_scan_code.toUpperCase() === input);

      if (!found) {
        setMessage({ type: 'error', text: 'Invalid scan code.' });
      } else if (scannedEquipment.find(eq => eq.equipment_scan_code === found.equipment_scan_code)) {
        setMessage({ type: 'error', text: 'This equipment is already scanned.' });
      } else {
        const isPrinterType = ['Label Printer', 'SU Printer', 'Roll Printer'].includes(found.equipment_type);
        const isAlreadyScannedPrinter = scannedEquipment.some(eq =>
          ['Label Printer', 'SU Printer', 'Roll Printer'].includes(eq.equipment_type)
        );

        const isAlreadyScanned = (type) =>
          scannedEquipment.some(eq => eq.equipment_type === type);

        if (
          isPrinterType &&
          expectedPrinterType &&
          found.equipment_type.trim().toLowerCase() !== expectedPrinterType
        ) {
          setMessage({
            type: 'error',
            text: `Wrong printer scanned. Job requires '${jobDetails.printertype}' but scanned '${found.equipment_type}'.`
          });
        } else if (isPrinterType && isAlreadyScannedPrinter) {
          setMessage({ type: 'error', text: 'Only one printer can be scanned (Label/SU/Roll).' });
        } else if (
          ['Workstation', 'Workcenter', 'Manual Pack'].includes(found.equipment_type) &&
          isAlreadyScanned(found.equipment_type)
        ) {
          setMessage({ type: 'error', text: `Only one ${found.equipment_type} can be scanned.` });
        } else {
          const updated = [...scannedEquipment, found];
          setScannedEquipment(updated);
          localStorage.setItem('registeredEquipments', JSON.stringify(updated));
          setMessage({ type: 'success', text: `${found.equipment_name} registered.` });
        }
      }

      setScanInput('');
    }
  };

  const removeScanned = (code) => {
    const updated = scannedEquipment.filter(item => item.equipment_scan_code !== code);
    setScannedEquipment(updated);
    localStorage.setItem('registeredEquipments', JSON.stringify(updated));
  };

  const handleConfirm = () => {
    const hasPrinter = scannedEquipment.some(item =>
      ['Label Printer', 'SU Printer', 'Roll Printer'].includes(item.equipment_type)
    );
    const hasWorkstation = scannedEquipment.some(item => item.equipment_type === 'Workstation');
    const hasWorkcenter = scannedEquipment.some(item => item.equipment_type === 'Workcenter');
    const hasManualPack = scannedEquipment.some(item => item.equipment_type === 'Manual Pack');

    if (hasPrinter && hasWorkstation && hasWorkcenter && hasManualPack) {
      localStorage.setItem('equipmentRegistered', 'true');
      setMessage({ type: 'success', text: 'Equipment registered. Redirecting...' });
      setTimeout(() => navigate('/pex'), 3000);
    } else {
      setMessage({ type: 'error', text: 'Register all required equipment!' });
    }
  };

  const handleCancel = () => {
    setScannedEquipment([]);
    localStorage.removeItem('registeredEquipments');
    setMessage({ type: '', text: '' });
    navigate('/pex');
  };

  return (
    <>
      <TopPanel />
      <div className="equipment-wrapper">
        <div className="equipment-registration-container">
          <div className="equipment-list">
            <h3>Equipment List</h3>
            <div className="equipment-scroll">
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th>Sn</th>
                    <th>Equipment Scan Code</th>
                    <th>Equipment Name</th>
                    <th>Equipment Type</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentList.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.equipment_scan_code}</td>
                      <td>{item.equipment_name}</td>
                      <td>{item.equipment_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="scanequipment">
          <h3>Register Equipments</h3>
          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={handleScan}
            placeholder="Scan equipment code and press Enter"
            className="eq_scan_input"
          />

          <table className="equipment-table">
            <thead>
              <tr>
                <th>Scan Code</th>
                <th>Equipment Name</th>
                <th>Equipment Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scannedEquipment.map((item, index) => (
                <tr key={index}>
                  <td>{item.equipment_scan_code}</td>
                  <td>{item.equipment_name}</td>
                  <td>{item.equipment_type}</td>
                  <td>
                    <button className='remove-eqp-btn' onClick={() => removeScanned(item.equipment_scan_code) }>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="action-buttons">
            <button onClick={handleConfirm} className="primary-button">Confirm</button>
            <button onClick={handleCancel} className="primary-button">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentRegistration;
