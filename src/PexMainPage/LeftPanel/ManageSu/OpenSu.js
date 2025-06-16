import { useState, useEffect } from 'react';
import './ManageSu.css';
import { useNavigate } from 'react-router-dom';

const OpenSu = () => {
  const [inputSUs, setInputSUs] = useState([]);
  const [outputSUs, setOutputSUs] = useState([]);
  const [scannedInputs, setScannedInputs] = useState([]);
  const [scannedOutput, setScannedOutput] = useState(null);
  const [scanValue, setScanValue] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const navigate = useNavigate();
const [scannedSample, setScannedSample] = useState(null);
const [scannedScrap, setScannedScrap] = useState(null);

  useEffect(() => {
    const fetchSUs = async () => {
      try {
        const response = await fetch('/DB_records/su.json');
        const dbData = await response.json();
        const localData = JSON.parse(localStorage.getItem('generatedSUs')) || [];
        const combinedData = [...dbData, ...localData];

        setInputSUs(combinedData.filter(su => su.type === 'Input'));
        setOutputSUs(combinedData.filter(su =>
          ['Output', 'Sample', 'Scrap'].includes(su.type)
        ));
      } catch (error) {
        console.error('Error fetching SU data:', error);
      }
    };

    fetchSUs();
  }, []);

  // const isPrimarySU = (su) => ['Output', 'Sample', 'Scrap'].includes(su.type);

const handleScan = (e) => {
  e.preventDefault();
  const trimmedId = scanValue.trim().toLowerCase();
  if (!trimmedId) return;

  const foundSU = [...inputSUs, ...outputSUs].find(
    su => su.id.toLowerCase() === trimmedId
  );

  if (!foundSU) {
    setWarningMessage('SU not found.');
    setScanValue('');
    return;
  }

  const alreadyScanned =
    (scannedOutput && scannedOutput.id.toLowerCase() === trimmedId) ||
    (scannedSample && scannedSample.id.toLowerCase() === trimmedId) ||
    (scannedScrap && scannedScrap.id.toLowerCase() === trimmedId) ||
    scannedInputs.some(su => su.id.toLowerCase() === trimmedId);

  if (alreadyScanned) {
    setWarningMessage('SU already scanned.');
    setScanValue('');
    return;
  }

  switch (foundSU.type) {
    case 'Output':
      if (scannedOutput) {
        setWarningMessage('Only one Output SU is allowed.');
      } else {
        setScannedOutput(foundSU);
        setWarningMessage('');
      }
      break;

    case 'Sample':
      if (!scannedOutput) {
        setWarningMessage('Scan Output SU before scanning Sample.');
      } else if (scannedSample) {
        setWarningMessage('Only one Sample SU is allowed.');
      } else {
        setScannedSample(foundSU);
        setWarningMessage('');
      }
      break;

    case 'Scrap':
      if (!scannedOutput) {
        setWarningMessage('Scan Output SU before scanning Scrap.');
      } else if (scannedScrap) {
        setWarningMessage('Only one Scrap SU is allowed.');
      } else {
        setScannedScrap(foundSU);
        setWarningMessage('');
      }
      break;

case 'Input':
  if (!scannedOutput) {
    setWarningMessage('Scan Output SU before scanning Input SUs.');
  } else {
    setScannedInputs(prev => [...prev, foundSU]);
    setWarningMessage('');
  }
  break;


    default:
      setWarningMessage('Invalid SU type.');
  }

  setScanValue('');
};


const handleConfirm = () => {
  if (!scannedOutput) {
    setWarningMessage('At least one Output SU is required.');
    return;
  }

  if (scannedInputs.length < 5) {
    setWarningMessage('Please scan at least 5 Input SUs.');
    return;
  }

  // const allScannedSUs = [
  //   ...(scannedOutput ? [scannedOutput] : []),
  //   ...(scannedSample ? [scannedSample] : []),
  //   ...(scannedScrap ? [scannedScrap] : []),
  //   ...scannedInputs,
  // ];

  localStorage.setItem('scannedSUs', JSON.stringify({
    output: scannedOutput,
    sample: scannedSample,
    scrap: scannedScrap,
    inputs: scannedInputs,
  }));
  localStorage.setItem('suSessionStatus', 'confirmed');
  navigate('/pex');
};


  const handleCancel = () => {
    navigate('/pex');
  };

  const renderTable = (title, data) => (
    <div className="open-su-section">
      <h3>{title}</h3>
      <table className="open-su-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((su, idx) => (
            <tr key={idx}>
              <td>{su.id}</td>
              <td>{su.type}</td>
              <td>{su.quantity ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="open-su">
      {renderTable('Available Output / Sample / Scrap SUs', outputSUs)}
      {renderTable('Available Input SUs', inputSUs)}

      <div className="opensuscanprocess">
        
        {warningMessage && (
          <div className="warning-message">
            <p>{warningMessage}</p>
          </div>
        )}
        <form onSubmit={handleScan}>
          <input
            type="text"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            placeholder="Scan SU ID"
            autoFocus
          />
          <button type="submit">Scan SU</button>
        </form>


 {(scannedOutput || scannedSample || scannedScrap) &&
  renderTable(
    'Scanned Output/Sample/Scrap SU',
    [scannedOutput, scannedSample, scannedScrap].filter(Boolean)
  )}

{scannedInputs.length > 0 &&
  renderTable('Scanned Inputs', scannedInputs)}



        <div className="button-group-opensu">
          <button onClick={handleConfirm} className="primary-button">Confirm & Save</button>
          <button onClick={handleCancel} className="primary-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default OpenSu;
