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
          <h3>Transactions for {selectedCustomer.customerName}</h3>
          <ul>
            {customerTransactions.map((transaction, index) => (
              <li key={index}>
                <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                <p>Type: {transaction.transactionType}</p>
                <p>Payment Method: {transaction.paymentMethod}</p>
                <p>Amount Received: {transaction.amountReceived}</p>
                <p>Total Amount: {transaction.totalAmount}</p>
                <p>Received By: {transaction.receivedBy}</p>
                <h4>Transaction Items:</h4>
                <ul>
                  {transaction.transactionItems.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <p>Item Name: {item.itemName}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Unit Price: {item.unitPrice}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

        </div>
    );
}

export default SearchTransaction;
