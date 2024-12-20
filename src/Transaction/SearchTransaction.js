import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router

function SearchTransaction() {
  const { transactionNumber } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/transactions');
        if (response.ok) {
          const data = await response.json();
          const foundTransaction = data.find(t => t.transactionNumber === parseInt(transactionNumber));
          if (foundTransaction) {
            setTransaction(foundTransaction);
            fetchCustomerName(foundTransaction.customerNumber); // Fetch customer name
          } else {
            setError('Transaction not found');
          }
        } else {
          setError('Failed to fetch transactions');
        }
      } catch (error) {
        setError('Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    const fetchCustomerName = async (customerNumber) => {
      try {
        const response = await fetch(`http://localhost:8080/api/customers/number/${customerNumber}`);
        if (response.ok) {
          const customerData = await response.json();
          setCustomerName(customerData.customerName); // Assuming the customer data includes a 'name' field
        } else {
          setCustomerName('Customer not found');
        }
      } catch (error) {
        setCustomerName('Error fetching customer');
      }
    };

    fetchTransaction();
  }, [transactionNumber]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const totalPaid = transaction.transactionAccounts.reduce((sum, account) => sum + account.amount, 0);
  const balance = transaction.totalAmount - totalPaid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="print-section">
        <div style={{ marginBottom: '20px' }}>
          <h2>Irfan Traders</h2>
          <h2>Transaction Details</h2>
          <p><strong>Transaction Date:</strong> {formatDate(transaction.date)}</p>
          <p><strong>Transaction Number:</strong> {transaction.transactionNumber}</p>
          <p><strong>Description:</strong> {transaction.description}</p>
          <p><strong>Customer Name:</strong> {customerName}</p>
          <p><strong>Customer Number:</strong> {transaction.customerNumber}</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Items</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: 'auto', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>S.No</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Item Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Unit Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Quantity</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', fontWeight: 'bold' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.transactionItems.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.itemName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.unitPrice}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.unitPrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', textAlign: 'right', marginRight: '20px' }}>
            <p><strong>Total Amount:</strong> {transaction.totalAmount}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginRight: '20px' }}>
          <h3>Payments</h3>
          {transaction.transactionAccounts.map((account, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p><strong>Account Name:</strong> {account.accountName}</p>
              <p><strong>Amount:</strong> {account.amount}</p>
            </div>
          ))}
          <div style={{ marginTop: '20px' }}>
            <p><strong>Total Paid:</strong> {totalPaid}</p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <p><strong>Balance:</strong> {balance}</p>
          </div>
        </div>
      </div>

      <div className="no-print">
        <button onClick={handlePrint}>Print this page</button>
      </div>
      
      {/* CSS to hide the print button on print */}
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default SearchTransaction;
