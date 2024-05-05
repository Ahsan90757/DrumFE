import React from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Transaction Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-transaction')}>Create a Transaction</p>

    </div>
  );
}

export default TransactionDashboard;
