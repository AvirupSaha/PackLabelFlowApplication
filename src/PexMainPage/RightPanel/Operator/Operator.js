import './Operator.css';
import { useNavigate } from 'react-router-dom';

const Operator = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/pex/operatorlogin');
  };

  return (
    <div className="operator">
      <button className="primary-button" onClick={handleClick}>
        Operator
      </button>
    </div>
  );
};

export default Operator;



