import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OperationalCost() {

  const navigate = useNavigate();


  return (
    <div>
      <h2>Operational Costs Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/todays-operational-cost')}>
        Today's Operational Costs
      </p>
      
    </div>
  );
}

export default OperationalCost;
