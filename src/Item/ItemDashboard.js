import React from 'react';
import { useNavigate } from 'react-router-dom';

function ItemDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Item Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-item')}>Create an Item</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/delete-item')}>Delete Item</p>

    </div>
  );
}

export default ItemDashboard;
