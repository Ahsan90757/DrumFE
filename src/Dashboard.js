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
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/account-dashboard')}>Account Dashboard</p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/income-statement')}>Income Statement</p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/operational-cost')}>Operational Cost</p>
        <p style={{ cursor: 'pointer' }} onClick={() => navigate('/daily-ledger')}>Daily Ledger</p>
    </div>
  );
}

export default Dashboard;
