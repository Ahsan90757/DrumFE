import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/create-item">Create Item</Link></li>
        <li><Link to="/create-customer">Create Customer</Link></li>
        <li><Link to="/create-transaction">Create Transaction</Link></li>
      </ul>
    </div>
  );
}

export default Dashboard;
