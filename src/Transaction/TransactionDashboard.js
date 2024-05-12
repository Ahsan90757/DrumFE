import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionDashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [positiveBalance, setPositiveBalance] = useState(0);
  const [negativeBalance, setNegativeBalance] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/customers');
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
          calculateBalances(data);
        } else {
          console.error('Failed to fetch customers:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCustomers();
  }, []);

  const calculateBalances = (customers) => {
    let positiveSum = 0;
    let negativeSum = 0;
    customers.forEach(customer => {
      if (customer.balance > 0) {
        positiveSum += customer.balance;
      } else {
        negativeSum += customer.balance;
      }
    });
    setPositiveBalance(positiveSum);
    setNegativeBalance(negativeSum);
  };

  return (
    <div>
      <h2>Transaction Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-transaction')}>Create a Transaction</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/search-transaction')}>Search a Transaction</p>
    
      <div>
      <h2>Customers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>#</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Last Transaction Date</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Number</th>
            <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Balance Amount</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 && customers.map((customer, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{new Date(customer.lastTransaction).toLocaleDateString()}</td>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{customer.customerName}</td>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{customer.customerNumber}</td>
              <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{customer.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px' }}>
        <strong>Total Positive Balance:</strong> {positiveBalance}
      </div>
      <div style={{ marginTop: '5px' }}>
        <strong>Total Negative Balance:</strong> {negativeBalance}
      </div>
    </div>

    </div>
  );
}

export default TransactionDashboard;
