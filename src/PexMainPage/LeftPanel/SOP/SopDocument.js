import React, { useEffect, useState } from 'react';
import './Sop.css';
import { useNavigate } from 'react-router-dom';

const SopDocument = () => {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setDocs([
      { name: 'Functional Specification Document', file: '/Documents/Functional_Specification_Document DOC^EX^FS-10255.pdf' },
      { name: 'Architecture Specification Document', file: '/Documents/Application_Architectural_Document DOC^AD-1952.pdf' },
      { name: 'Technical Specification Document', file: '/Documents/Technical documentation DOC^TD-17882.pdf' },
      { name: 'SOP Document', file: '/Documents/SOP document DOC^SOP-119927.pdf' }
      
    ]);
  }, []);

  return (
    <div className="sop-docs">
      <h2>Documentation</h2>
      <table className="sop-table">
        <thead>
          <tr>
            <th> Document Name</th>
            <th> Link</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, index) => (
            <tr key={index}>
              <td>{doc.name}</td>
              <td>
                <a
                  href={doc.file}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-link"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sop-buttons">
        <button className="primary-button" onClick={() => navigate('/sopdocumentcredit')}>
          Credits
        </button>
        <button className="primary-button" onClick={() => navigate('/pex')}>
          Back
        </button>
      </div>
    </div>
  );
};

export default SopDocument;
