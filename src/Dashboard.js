import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/item-dashboard')}>Item Dashboard</p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/customer-dashboard')}>Customer Dashboard</p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/transaction-dashboard')}>Transaction Dashboard</p>
    </div>
  );
}

export default Dashboard;
