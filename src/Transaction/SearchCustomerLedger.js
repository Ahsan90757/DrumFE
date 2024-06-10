import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SearchCustomerLedger() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [matchingCustomers, setMatchingCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const navigate = useNavigate();
  const { customerNumber } = useParams(); // Get customer number from URL if available

  useEffect(() => {
    // Fetch all customers from the backend API when component mounts
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/customers');
        if (response.ok) {
          const data = await response.json();
          setAllCustomers(data);
          // Auto-select customer if customer number is provided in the URL
          if (customerNumber) {
            const selectedCustomer = data.find(customer => customer.customerNumber === customerNumber);
            if (selectedCustomer) {
              handleCustomerSelect(selectedCustomer);
            }
          }
        } else {
          console.error('Failed to fetch items:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCustomers();
  }, [customerNumber]);

  const handleCustomerSearch = (text) => {
    setCustomerSearchText(text);
    if (text.trim() === '') {
      // If search text is empty, clear the matching customers
      setMatchingCustomers([]);
    } else {
      // Filter customers based on search text
      const filteredCustomers = allCustomers.filter(customer =>
        customer.customerName.toLowerCase().includes(text.toLowerCase())
      );
      setMatchingCustomers(filteredCustomers);
    }
  };

  const handleCustomerSelect = async (selectedCustomer) => {
    // Set the selected customer
    setSelectedCustomer(selectedCustomer);
    // Clear search text and matching customers after customer selection
    setCustomerSearchText('');
    setMatchingCustomers([]);

    try {
      const response = await fetch(`http://localhost:8080/api/transactions`);
      if (response.ok) {
        const data = await response.json();
        // Filter transactions by selected customer
        const filteredTransactions = data.filter(transaction => transaction.customerNumber === selectedCustomer.customerNumber);
        setCustomerTransactions(filteredTransactions);
      } else {
        console.error('Failed to fetch transactions:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    resetCumulativeBalance();
  };

  let cumulativeBalance = 0;
  function calculateBalance(transaction) {
    if (transaction.transactionType == "selling")
      cumulativeBalance = cumulativeBalance + transaction.totalAmount;
    else if(transaction.transactionType == "buying")
      cumulativeBalance = cumulativeBalance - transaction.totalAmount;

    return cumulativeBalance;
  }

  function calculateAccountBalance(account, currentIndex) {
    if(customerTransactions[currentIndex].transactionType=="selling")
    cumulativeBalance = cumulativeBalance - account.amount;
    else if(customerTransactions[currentIndex].transactionType=="buying")
    cumulativeBalance = cumulativeBalance + account.amount;
    return cumulativeBalance;
  }

  function resetCumulativeBalance() {
    cumulativeBalance = 0;
  }

  return (
    <div>
      <div>
        <label htmlFor="searchCustomer">Search Customer:</label>
        <input
          type="text"
          id="searchCustomer"
          value={customerSearchText}
          onChange={(e) => handleCustomerSearch(e.target.value)}
        />
        {customerSearchText.trim() !== '' && (
          <ul>
            {matchingCustomers.map((customer, index) => (
              <li key={index} onClick={() => handleCustomerSelect(customer)}>
                {customer.customerName + "  " + customer.customerNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3>Selected Customer:</h3>
        <p>{selectedCustomer ? "Customer Name = " + selectedCustomer.customerName + "  Customer Number = " + selectedCustomer.customerNumber : 'No customer selected'}</p>
      </div>

      {selectedCustomer && (
        <div>
          <h2>Ledger</h2>
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>#</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Date</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Description</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Debit</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Credit</th>
                  <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {customerTransactions.map((transaction, index) => (
                  <React.Fragment key={index}>
                    <tr style={{ backgroundColor: '#ffffff' }} onClick={() => navigate(`/search-transaction/${transaction.transactionNumber}`)}>
                      <td style={{ fontWeight: 'bold', padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 'bold', padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                        Transaction {transaction.transactionNumber + (transaction.Description ? `: ${transaction.Description}` : '')}
                      </td>
                      {transaction.transactionType === 'selling' ? (
                        <>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{transaction.totalAmount}</td>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0</td>

                        </>
                      ) : (
                        <>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0</td>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{transaction.totalAmount}</td>
                        </>
                      )}
                      <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{calculateBalance(transaction)}</td>
                    </tr>
                    {transaction.transactionAccounts.map((account, accIndex) => (
                      <tr key={accIndex} style={{ backgroundColor: '#ffffff' }}>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}></td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{account.accountName}</td>
                        
                        {transaction.transactionType === 'selling' ? (
                          <>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0</td>
                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{account.amount}</td>
                        </>
                        ) :  (
                          <>
                            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{account.amount}</td>
                            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>0</td>
                          </>
                          
                        )}
                        <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{calculateAccountBalance(account, index)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchCustomerLedger;
