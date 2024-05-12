import React, { useState, useEffect } from 'react';

function SearchTransaction() {



    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearchText, setCustomerSearchText] = useState('');
    const [matchingCustomers, setMatchingCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [customerTransactions, setCustomerTransactions] = useState([]);

    useEffect(() => {
        // Fetch all customers from the backend API when component mounts
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/customers');
                if (response.ok) {
                    const data = await response.json();
                    setAllCustomers(data);
                } else {
                    console.error('Failed to fetch items:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchCustomers();
    }, []);

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
    };

    const calculateBalance = (index) => {
        let balance = 0;
        for (let i = 0; i <= index; i++) {
          balance += customerTransactions[i].totalAmount - customerTransactions[i].amountReceived;
        }
        return balance;
      };

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
            

            {setSelectedCustomer && (
  <div>
    <h2>Ledger</h2>
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
          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{new Date(transaction.date).toLocaleDateString()}</td>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{transaction.transactionNumber}</td>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{transaction.totalAmount}</td>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{transaction.amountReceived}</td>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{calculateBalance(index)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


        </div>
    );
}

export default SearchTransaction;
