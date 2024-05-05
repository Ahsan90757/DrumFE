import React from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Customer Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-customer')}>Create a Customer</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/delete-customer')}>Delete a Customer</p>

    </div>
  );
}

export default CustomerDashboard;
