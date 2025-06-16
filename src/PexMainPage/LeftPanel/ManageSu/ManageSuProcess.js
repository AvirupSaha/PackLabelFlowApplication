import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ManageSu.css';

const ManageSuProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, suLabels } = location.state || {};

  const handleCancel = () => {
    navigate('/pex');
  };

  const handleConfirm = () => {
    if (!suLabels || suLabels.length === 0) return;

    const newSUs = suLabels.map(id => ({
      id,
      type,
      quantity: Math.floor(Math.random() * (5000 - 500 + 1)) + 500
    }));

    const existing = JSON.parse(localStorage.getItem('generatedSUs')) || [];
    const merged = [...existing, ...newSUs];

    localStorage.setItem('generatedSUs', JSON.stringify(merged));
    navigate('/pex');
  };

  return (
    <div className="su-container">
      <h2>{type} SUs Generated</h2>

      {suLabels && suLabels.length > 0 ? (
        <table className="su-table">
          <thead>
            <tr>
              <th>SU ID</th>
              <th>Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {suLabels.map((suId, index) => {
              const quantity = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
              return (
                <tr key={index}>
                  <td>{suId}</td>
                  <td>{type}</td>
                  <td>{quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No SUs generated.</p>
      )}

      <div className="action-buttons">
        <button className="primary-button" onClick={handleConfirm}>Confirm and Save</button>
        <button className="primary-button" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ManageSuProcess;
