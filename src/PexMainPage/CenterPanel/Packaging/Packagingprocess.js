import React, { useState, useEffect } from 'react';
import './Packaging.css';
import { useNavigate } from 'react-router-dom';
import TopPanel from '../../TopPanel/TopPanel';

const Packagingprocess = () => {
  const [barcodes, setBarcodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [orderQty, setOrderQty] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('packagingCompleted'); 

    const session = JSON.parse(localStorage.getItem('progressSession'));
    const qty = session?.total || 0;
    setOrderQty(qty);

    fetch('/DB_records/Barcode.json')
      .then(res => res.json())
      .then(data => {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, qty);
        setBarcodes(selected);
      })
      .catch(err => {
        console.error("Failed to fetch barcode data:", err);
        setError("Error loading barcodes. Please try again.");
      });
  }, []);

  const handleScan = () => {
    if (inputValue === barcodes[currentIndex]) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setInputValue('');
      setError('');

      const session = JSON.parse(localStorage.getItem('progressSession')) || {};
      localStorage.setItem('progressSession', JSON.stringify({
        ...session,
        current: nextIndex,
        progress: (nextIndex / orderQty) * 100,
      }));

      if (nextIndex === barcodes.length) {
        setCompleted(true);
        localStorage.setItem('packagingCompleted', 'true'); // ✅ set flag
      }
    } else {
      setError('Incorrect Barcode!');
    }
  };

  const handleBack = () => {
    navigate('/pex');
  };

  return (
    <div className="packagingprocess">
      <TopPanel
        progress={(currentIndex / orderQty) * 100}
        current={currentIndex}
        total={orderQty}
      />

      <div className="packagingpanel">
        <h2>Labelling</h2>

        <div className="prevcurkit">
          <div className="prevcurkit-row">
            <div className="prevcurkit-label">Previous Kit:</div>
            <div className="prevcurkit-value">
              {currentIndex === 0 ? 'N/A' : barcodes[currentIndex - 1]}
            </div>
          </div>
          <div className="prevcurkit-row">
            <div className="prevcurkit-label">Current Kit:</div>
            <div className="prevcurkit-value">
              {currentIndex < barcodes.length ? barcodes[currentIndex] : 'N/A'}
            </div>
          </div>
        </div>

        {completed ? (
          <div>
            <div className="completed-popup">Packaging Completed!</div>
            <button onClick={handleBack} className="back-button">Back</button>
          </div>
        ) : (
          <>
            {barcodes.length > 0 && (
              <>
                <p><strong>Scan this barcode:</strong> {barcodes[currentIndex]}</p>

                {barcodes[currentIndex]?.startsWith('SAMPLE00') && (
                  <p className="blinking-message">This is sample kit</p>
                )}

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter barcode to scan"
                />

                <div className="button-group-pkg">
                  <button onClick={handleScan} className="primary-button">Scan</button>
                  <button onClick={handleBack} className="back-button">Cancel</button>
                </div>

                {error && <p className="error">{error}</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Packagingprocess;
