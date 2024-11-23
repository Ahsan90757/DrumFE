import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  return (
    <div>
      <h2>Item Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-item')}>Create an Item</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/delete-item')}>Delete Item</p>

      <table>
        <thead>
          <tr>
            <th style={{ paddingRight: '50px' }}>Name</th>
            <th style={{ paddingRight: '50px' }}>Remaining Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.name}>
              <td style={{ paddingRight: '50px' }}>{item.name}</td>
              <td style={{ paddingRight: '50px' }}>{item.remainingQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemDashboard;
