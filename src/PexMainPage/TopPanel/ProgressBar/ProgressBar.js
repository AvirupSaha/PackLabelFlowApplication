import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current = 0, total = 0 }) => {
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const isCompleted = percent === 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">
          Progress: {current} of {total} completed
        </span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${isCompleted ? 'completed' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
