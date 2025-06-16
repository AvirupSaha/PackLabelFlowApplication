import React, { useState } from 'react';
import './ManageSu.css';
import { useNavigate } from 'react-router-dom';

const LabelSu = () => {
  const navigate = useNavigate();
  const [suCount, setSuCount] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (digit) => {
    const newValue = suCount + digit;
    const numericValue = parseInt(newValue, 10);

    if (numericValue > 10) {
      setError('Label count should be between 1 and 10');
      return;
    }

    setSuCount(newValue);
    setError('');
  };

  const handleBackspace = () => {
    const newValue = suCount.slice(0, -1);
    setSuCount(newValue);
    setError('');
  };

  const handleClear = () => {
    setSuCount('');
    setError('');
  };

  const handleCancel = () => {
    navigate('/pex');
  };

  const generateSULabels = (prefix, count) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      labels.push(`${prefix}${randomNum}`);
    }
    return labels;
  };

  const handleSubmit = (type) => {
    const count = parseInt(suCount, 10);

    if (!count || count < 1 || count > 10) {
      setError('Label count should be between 1 and 10');
    } else {
      setError('');

      let prefix;
      if (type === 'Sample') prefix = 'A';
      else if (type === 'Output') prefix = 'V';
      else if (type === 'Scrap') prefix = 'S';

      const suLabels = generateSULabels(prefix, count);

      const existing = JSON.parse(localStorage.getItem('suLabels')) || [];
      const updated = [...existing, ...suLabels.map(label => ({ id: label, type }))];
      localStorage.setItem('suLabels', JSON.stringify(updated));
      localStorage.setItem('labelSuCompleted', 'true');

      navigate('/manage-su/manage-su-process', {
        state: {
          suCount: count,
          type,
          suLabels
        }
      });
    }
  };

  return (
    <div className="label-su"> <div className='heading-labelsu'><u>LABEL SU</u></div>
      <div className="label-su-count">
       
        <label htmlFor="su-count">Number of Labels to Print:</label>
        <input id="su-count" type="text" value={suCount} readOnly />
         <button className="primary-button" onClick={handleCancel}>Cancel</button>
      </div>

      <div className="button-group">
        <button className="primary-button" onClick={() => handleSubmit('Sample')}>Sample</button>
        <button className="primary-button" onClick={() => handleSubmit('Output')}>Output</button>
        <button className="primary-button" onClick={() => handleSubmit('Scrap')}>Scrap</button>
      </div>

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button key={digit} onClick={() => handleInputChange(digit.toString())} className="number-button">
            {digit}
          </button>
        ))}
        <button onClick={handleClear} className="number-button special">Clear</button>
        <button onClick={handleBackspace} className="number-button special">←</button>
      </div>
 <div className='error-message-limit'>{error && <div className="error-message">{error}</div>}</div>
    </div>
  );
};

export default LabelSu;
