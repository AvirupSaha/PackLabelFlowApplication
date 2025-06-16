import React, { useState, useEffect } from 'react';
import './ManageSu.css';
import { useNavigate } from 'react-router-dom';

const CloseSu = () => {
  const navigate = useNavigate();

  const [savedInputs, setSavedInputs] = useState([]);
  const [savedOutput, setSavedOutput] = useState(null);
  const [savedSample, setSavedSample] = useState(null);
  const [savedScrap, setSavedScrap] = useState(null);

  const [closedInputs, setClosedInputs] = useState([]);
  const [closedOutput, setClosedOutput] = useState(null);
  const [closedSample, setClosedSample] = useState(null);
  const [closedScrap, setClosedScrap] = useState(null);

  const [scanValue, setScanValue] = useState('');
  const [closeQty, setCloseQty] = useState('');
  const [status, setStatus] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    const packagingDone = localStorage.getItem('packagingCompleted') === 'true';

    if (!packagingDone) {
      setWarningMessage('Packaging not completed! Please complete packaging before closing SU.');
      return;
    }

    const savedData = JSON.parse(localStorage.getItem('scannedSUs'));
    if (!savedData || !savedData.inputs || !savedData.output) {
      setWarningMessage('No Opened SU found to close!');
    } else {
      setSavedInputs(savedData.inputs || []);
      setSavedOutput(savedData.output || null);
      setSavedSample(savedData.sample || null);
      setSavedScrap(savedData.scrap || null);
    }
  }, [navigate]);

  const handleScan = (e) => {
    e.preventDefault();
    const scannedId = scanValue.trim().toLowerCase();
    const qty = Number(closeQty);

    setScanValue('');
    setCloseQty('');

    if (!scannedId || isNaN(qty) || qty < 0) {
      setStatus('Invalid scan or quantity');
      return;
    }

    const inputMatch = savedInputs.find(su => su.id.toLowerCase() === scannedId);
    const alreadyClosedInput = closedInputs.find(su => su.id.toLowerCase() === scannedId);

    if (inputMatch && !alreadyClosedInput) {
      const openQty = Number(inputMatch.quantity || 0);
      const restQty = openQty - qty;

      const closedSU = {
        ...inputMatch,
        openQty,
        closeQty: qty,
        restQty: restQty >= 0 ? restQty : 0
      };

      setClosedInputs([...closedInputs, closedSU]);
      setStatus(`Closed Input SU: ${inputMatch.id}`);
      setWarningMessage('');
      return;
    }

    if (
      closedInputs.length === savedInputs.length &&
      savedOutput?.id?.toLowerCase() === scannedId &&
      !closedOutput
    ) {
      setClosedOutput(savedOutput);
      setStatus(`Closed Output SU: ${savedOutput.id}`);
      setWarningMessage('');
      return;
    }

    if (
      closedInputs.length === savedInputs.length &&
      savedSample?.id?.toLowerCase() === scannedId &&
      !closedSample
    ) {
      setClosedSample(savedSample);
      setStatus(`Closed Sample SU: ${savedSample.id}`);
      setWarningMessage('');
      return;
    }

    if (
      closedInputs.length === savedInputs.length &&
      savedScrap?.id?.toLowerCase() === scannedId &&
      !closedScrap
    ) {
      setClosedScrap(savedScrap);
      setStatus(`Closed Scrap SU: ${savedScrap.id}`);
      setWarningMessage('');
      return;
    }

    setStatus('Invalid scan. Please check for correct SU to close!');
  };

  const handleConfirmSave = () => {
    localStorage.removeItem('scannedSUs');

    const closedSUData = {
      inputs: closedInputs,
      outputs: [closedOutput],
      sample: closedSample,
      scrap: closedScrap,
      restQty: closedInputs.reduce((sum, su) => sum + (su.restQty || 0), 0),
    };

    localStorage.setItem('closedSUData', JSON.stringify(closedSUData));
    localStorage.setItem('packagingCompleted', 'true');
    localStorage.setItem('closedSUCompleted', 'true');

    setStatus('SU Closure completed!');
    setWarningMessage('Opened SUs are now Closed!');

    setTimeout(() => {
      navigate('/pex');
    }, 3000);
  };


  const handleCancel = () => {
    navigate('/pex');
  };

  const allInputsClosed = closedInputs.length === savedInputs.length;
  const allSUsClosed =
    allInputsClosed &&
    (savedOutput ? closedOutput : true) &&
    (savedSample ? closedSample : true) &&
    (savedScrap ? closedScrap : true);

  const scanDisabled =
    warningMessage.includes('No Opened SU found') ||
    warningMessage.includes('Packaging not completed');

  return (
    <div className="close-su">
      <h2>Close Opened SUs</h2>

      <div className="status-messages">
        {status && <p className="status-text">{status}</p>}
        {allSUsClosed && !warningMessage.includes('Packaging not completed') && (
          <h4 className="success-text" style={{ color: 'green' }}>
            ✅ All opened SUs closed!
          </h4>
        )}

        {warningMessage && <div className="warning-message">{warningMessage}</div>}
      </div>

      <form onSubmit={handleScan}>
        <div className="closesuwrapper">
          <div className="input-line">
            <input
              type="text"
              value={scanValue}
              className="sutoclose"
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="Scan SU"
              autoFocus
              disabled={scanDisabled}
            />
            <input
              type="number"
              className="suqty"
              placeholder="Qty"
              value={closeQty}
              onChange={(e) => setCloseQty(e.target.value)}
              disabled={scanDisabled}
            />
            <button
              type="submit"
              className="primary-button"
              disabled={scanDisabled}
            >
              Scan SU
            </button>
          </div>

          <div className="button-line">
           <button
  type="button"
  onClick={handleConfirmSave}
  className="primary-button"
  disabled={
    !allSUsClosed || warningMessage.includes('Packaging not completed')
  }
>
  Confirm & Save
</button>

            <button
              type="button"
              className="primary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      <div className="closesu-wrapper">
        <div className="closesu-wrapper-left">
          <div className="su-section">
            <h3>Remaining Input SUs to Close</h3>
            {savedInputs.filter((su) => !closedInputs.find((c) => c.id === su.id)).length === 0 ? (
              <p>No input SUs to close</p>
            ) : (
              <table className="closed-su-table">
                <thead>
                  <tr>
                    <th>SU ID</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {savedInputs
                    .filter((su) => !closedInputs.find((c) => c.id === su.id))
                    .map((su, idx) => (
                      <tr key={idx}>
                        <td>{su.id}</td>
                        <td>{su.type}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="su-section">
            <h3>Closed or Opened Output, Sample, and/or Scrap SU</h3>
            <table className="closed-su-table">
              <thead>
                <tr>
                  <th>SU Type</th>
                  <th>SU ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {savedOutput && (
                  <tr>
                    <td>Output</td>
                    <td>{savedOutput.id}</td>
                    <td>{closedOutput ? '✅ Closed' : '❌ Not Closed'}</td>
                  </tr>
                )}
                {savedSample && (
                  <tr>
                    <td>Sample</td>
                    <td>{savedSample.id}</td>
                    <td>{closedSample ? '✅ Closed' : '❌ Not Closed'}</td>
                  </tr>
                )}
                {savedScrap && (
                  <tr>
                    <td>Scrap</td>
                    <td>{savedScrap.id}</td>
                    <td>{closedScrap ? '✅ Closed' : '❌ Not Closed'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="closesu-wrapper-right">
          <div className="su-section">
            <h3>Closed Input SUs</h3>
            <table className="closed-su-table">
              <thead>
                <tr>
                  <th>SU ID</th>
                  <th>Type</th>
                  <th>Open Qty</th>
                  <th>Close Qty</th>
                  <th>Rest Qty</th>
                </tr>
              </thead>
              <tbody>
                {closedInputs.map((su, idx) => (
                  <tr key={idx}>
                    <td>{su.id}</td>
                    <td>{su.type}</td>
                    <td>{su.openQty}</td>
                    <td>{su.closeQty}</td>
                    <td>{su.restQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloseSu;
