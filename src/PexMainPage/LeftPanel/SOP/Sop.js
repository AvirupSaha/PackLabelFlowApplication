import React from 'react';
import './Sop.css';
import { useNavigate } from 'react-router-dom';

const Sop = () => {
  const navigate = useNavigate();

  return (
    <div className="sopbtn">
      <button className="primary-button" onClick={() => navigate('/sopdocument')}>
        SOP
      </button>
    </div>
  );
};

export default Sop;
