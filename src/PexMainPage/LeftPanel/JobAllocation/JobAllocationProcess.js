import React, { useEffect, useState } from 'react';
import './JobAllocation.css';
import { useNavigate } from 'react-router-dom';
import { useJob } from './Jobcontext';

const JobAllocationProcess = () => {
  const navigate = useNavigate();
  const { setAllocatedJob, setAllocatedOrder } = useJob();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [credentialsShown, setCredentialsShown] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedJobDetails = jobs.find(j => j.job === selectedJob);

  useEffect(() => {
    fetch('/DB_records/Job.json')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Failed to load Job data:", err));
  }, []);

  const handleAllocate = () => {
    if (selectedJob) {
      setConfirming(true);
    }
  };

  const handleConfirmYes = () => {
    setConfirming(false);
    setCredentialsShown(true);
    setError('');
  };

  const handleConfirmNo = () => {
    resetState();
    navigate('/pex');
  };

  const handleCancel = () => {
    resetState();
    navigate('/pex');
  };

  const resetState = () => {
    setSelectedJob('');
    setScanCodeInput('');
    setOperatorPassword('');
    setConfirming(false);
    setCredentialsShown(false);
    setError('');
    setSuccessMessage('');
  };

  const handleValidateCredentials = () => {
    setError('');
    fetch('/DB_records/Operator.json')
      .then(res => res.json())
      .then(data => {
        const matchedOperator = data.find(
          op => op.scanCode === scanCodeInput && op.password === operatorPassword
        );

        if (matchedOperator && selectedJobDetails) {
          setAllocatedJob(selectedJob);
          setAllocatedOrder(selectedJobDetails.order);

          localStorage.setItem('allocatedJob', selectedJob);
          localStorage.setItem('jobAllocated', 'true');
          localStorage.setItem('allocatedPrinterType', selectedJobDetails.printertype || '');
          localStorage.setItem('allocatedJobDetails', JSON.stringify(selectedJobDetails));

          localStorage.setItem('progressSession', JSON.stringify({
            progress: 0,
            current: 0,
            total: parseInt(selectedJobDetails.orderqty || '0', 10)
          }));

          setSuccessMessage(`Job ${selectedJob} successfully allocated!`);
          setCredentialsShown(false);
          setScanCodeInput('');
          setOperatorPassword('');

          setTimeout(() => {
            setSuccessMessage('');
            navigate('/pex', {
              state: {
                operator: matchedOperator,
                Job: selectedJob,
                Order: selectedJobDetails.order
              }
            });
          }, 3000);
        } else {
          setError('Invalid Credentials!');
        }
      })
      .catch(err => {
        console.error('Error loading operator.json:', err);
        setError('Failed to validate credentials');
      });
  };

  return (
    <div className="Joballocationprocess joballocate">
      {!confirming && !credentialsShown && !successMessage && (
        <>
          <h3>Select a Job to Allocate</h3>
          <select
            onChange={(e) => setSelectedJob(e.target.value)}
            value={selectedJob}
            className="joballocate-select"
          >
            <option value="" disabled className="joballocate-option">Select Job</option>
            {jobs.map((job) => (
              <option key={job.job} value={job.job}>
                {job.job}
              </option>
            ))}
          </select>

          <div className="button-okcancel">
            <button onClick={handleAllocate} disabled={!selectedJob} className="primary-button">
              Okay
            </button>
            <button onClick={handleCancel} className="primary-button">
              Cancel
            </button>
          </div>
        </>
      )}

      {confirming && (
        <div className="popup-rmal">
          <p>Do you want to allocate <strong>Job Id: {selectedJob}</strong>?</p>
          <div className='btn-grp'>
            <button className="primary-button" onClick={handleConfirmYes}>Yes</button>
            <button className="primary-button" onClick={handleConfirmNo}>No</button>
          </div>
        </div>
      )}

      {credentialsShown && (
        <div className="popup-rmal">
          <p><b>Enter Operator Credentials to Allocate Job</b></p>
          <label>Scan Code</label>
          <input
            type="text"
            placeholder="Scan Code"
            className="inputclean-rmal"
            value={scanCodeInput}
            onChange={(e) => setScanCodeInput(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            className="inputclean-rmal"
            value={operatorPassword}
            onChange={(e) => setOperatorPassword(e.target.value)}
          />
          <div className="button-group">
            <button className="primary-button" onClick={handleValidateCredentials}>Proceed</button>
            <button className="primary-button cancel" onClick={handleCancel}>Cancel</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {successMessage && (
        <div className="popup-success">
          <p>{successMessage}</p>
          <button className="primary-button" onClick={handleConfirmNo}>Back</button>
        </div>
      )}
    </div>
  );
};

export default JobAllocationProcess;
