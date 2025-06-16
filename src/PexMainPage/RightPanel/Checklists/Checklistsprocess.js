import React, { useEffect, useState } from 'react';
import './Checklists.css';
import { useNavigate } from 'react-router-dom';

const ChecklistsProcess = () => {
  const navigate = useNavigate();
  const [checklistItems, setChecklistItems] = useState([]);
  const [responses, setResponses] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    const checklistStatus = localStorage.getItem('checklistCompleted');
    if (checklistStatus === 'true') {
      setAlreadyCompleted(true);
      setLoading(false);
      return;
    }

    fetch('/DB_records/Checklists.json')
      .then(res => res.json())
      .then(data => {
        setChecklistItems(data);
        setResponses(Array(data.length).fill(null));
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load checklist:', error);
        setLoading(false);
      });
  }, []);

  const handleRadioChange = (index, value) => {
    const updated = [...responses];
    updated[index] = value;
    setResponses(updated);
  };

  const handleConfirm = () => {
    localStorage.setItem('checklistCompleted', 'true');
    setShowMessage(true);
    setTimeout(() => {
      navigate('/pex');
    }, 3000);
  };

  const handleCancel = () => {
    setResponses(Array(checklistItems.length).fill(null));
    setConfirmed(false);
    navigate('/pex');
  };

  const allYes = responses.length > 0 && responses.every(item => item === 'yes');

  if (loading) return <div className="loading">Loading checklist...</div>;

  if (alreadyCompleted) {
    return (
      <div className="checklistsprocess completed-state">
        <h3>✅ Checklist already completed</h3>
        <button className="primary-button" onClick={() => navigate('/pex')}>Back</button>
      </div>
    );
  }

  return (
    <div className="checklistsprocess">
      <form className="checklistcheck">
        <table className="checklist-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Checklist Item</th>
              <th>Yes</th>
              <th>No</th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                <td>{item.label}</td>
                <td>
                  <input
                    type="radio"
                    name={`checklist-${index}`}
                    value="yes"
                    checked={responses[index] === 'yes'}
                    onChange={() => handleRadioChange(index, 'yes')}
                    className="large-radio"
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`checklist-${index}`}
                    value="no"
                    checked={responses[index] === 'no'}
                    onChange={() => handleRadioChange(index, 'no')}
                    className="large-radio"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <div className="confirmation">
        <label>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
            disabled={!allYes}
          />
          I hereby confirm that all operational prerequisites have been reviewed and fulfilled.
        </label>
      </div>

      <div className="buttons">
        <button
          type="button"
          className="primary-button"
          onClick={handleConfirm}
          disabled={!allYes || !confirmed}
        >
          OK
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {showMessage && (
        <div className="checklist-message">
          Checklist has been completed. Redirecting...
        </div>
      )}
    </div>
  );
};

export default ChecklistsProcess;
