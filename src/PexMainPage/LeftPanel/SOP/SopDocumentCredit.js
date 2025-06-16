import React from 'react';
import './Sop.css';
import { useNavigate } from 'react-router-dom';

const SopDocumentCredits = () => {
  const navigate = useNavigate();

  return (
    <div className="sop-docs-credit">
      <h2>Credits</h2>
    
<p> This application was developed and engineered by <strong>Avirup Saha</strong>, who led the design and implementation of the full-stack architecture. His responsibilities included user interface design, integration of operational workflows and ensuring compliance with domain-specific packaging and labeling processes used in clinical trials. </p> 
<p> The developer played a key role in designing application functionalities and restructuring the overall flow to ensure logical consistency and operational correctness. Valuable knowledge transfer support was also provided—particularly for the implementation and logic of the reconciliation module. </p> 
<p> This application focuses on the execution of packaging and labeling activities for clinical trials. It is designed to support Good Clinical Practice and ensure compliance with regulatory standards related to investigational medicinal products. The module covers the complete workflow—from operator login, job and room allocation, equipment registration and checklist validation to final packaging and reconciliation processes. </p> 
<p> The system includes real-time validations, operator credential checks, controlled Storage Unit tracking and barcode scanning integration for label verification. It ensures accountability, traceability and accuracy at each stage of the packaging lifecycle. </p> 
<p> Additionally, Standard Operating Procedure access and documentation modules are integrated to guide users through compliant operations. The platform is built with usability, operational efficiency and audit-readiness in mind, making it a robust and reliable solution for clinical packaging environments. </p>

      <button className="primary-button" onClick={() => navigate('/pex')}>
        Back
      </button>
    </div>
  );
};

export default SopDocumentCredits;
