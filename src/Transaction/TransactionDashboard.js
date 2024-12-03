import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionDashboard() {
  const [customers, setCustomers] = useState([]);
  const [positiveBalance, setPositiveBalance] = useState(0);
  const [negativeBalance, setNegativeBalance] = useState(0);
  const [Balance, setBalance] = useState(0);
  const [editingCustomerNumber, setEditingCustomerNumber] = useState(null);
  const [newReminder, setNewReminder] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customers');
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.lastTransaction) - new Date(a.lastTransaction));
        setCustomers(sortedData);
        calculateBalances(sortedData);
      } else {
        console.error('Failed to fetch customers:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateBalances = (customers) => {
    let positiveSum = 0;
    let negativeSum = 0;
    customers.forEach((customer) => {
      if (customer.balance > 0) {
        positiveSum += customer.balance;
      } else {
        negativeSum += customer.balance;
      }
    });
    setPositiveBalance(positiveSum);
    setNegativeBalance(negativeSum);
    setBalance(positiveSum + negativeSum);
  };

  const handleEditReminder = (customerNumber, reminder) => {
    setEditingCustomerNumber(customerNumber);
    setNewReminder(reminder || ''); // Set to empty string if reminder is null
  };
  

  const handleSaveReminder = async () => {
    try {
      const updatedCustomer = {
        ...customers.find((customer) => customer.customerNumber === editingCustomerNumber),
        reminder: newReminder,
      };
  
      console.log('Updated Customer Payload:', updatedCustomer); // Debug log
  
      await fetch(`http://localhost:8080/api/customers/${editingCustomerNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });
  
      setEditingCustomerNumber(null);
      setNewReminder('');
      fetchCustomers(); // Re-fetch customers to update the UI
    } catch (error) {
      console.error('There was an error updating the reminder!', error);
    }
  };
  


  return (
    <div>
      <h2>Transaction Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-transaction')}>
        Create a Transaction
      </p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/search-customer-ledger')}>
        Search Customer Ledger
      </p>

      <style>
        {`
      @media print {
        .no-print {
          display: none !important;
        }
      }
    `}
      </style>

      <button className="no-print" onClick={() => window.print()}>
        Print
      </button>

      <div>
        <h2>Customers</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>#</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Last Transaction Date</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Reminder</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Number</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Balance Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 &&
              customers.map((customer, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {new Date(customer.lastTransaction).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }} onClick={() => navigate(`/search-customer-ledger/${customer.customerNumber}`)}>
                    {customer.customerName}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {editingCustomerNumber === customer.customerNumber ? (
                      <>
                        <input
                          type="text"
                          value={newReminder}
                          onChange={(e) => {
                            setNewReminder(e.target.value);
                          }}
                        />

                        <button onClick={handleSaveReminder}>Save</button>
                      </>
                    ) : (
                      <>
                        {customer.reminder}
                        <button
                          onClick={() =>
                            handleEditReminder(customer.customerNumber, customer.reminder)
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}

                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {customer.customerNumber}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {customer.balance}
                  </td>
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
        <div style={{ marginTop: '5px' }}>
          <strong>Total Balance:</strong> {Balance}
        </div>
      </div>
    </div>
  );
}

export default TransactionDashboard;
