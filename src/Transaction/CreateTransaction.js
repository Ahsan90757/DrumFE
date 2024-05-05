import React, { useState, useEffect } from 'react';

function CreateTransaction() {
  const [customerId, setCustomerId] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemSearchText, setItemSearchText] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [matchingItems, setMatchingItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [matchingCustomers, setMatchingCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);


  useEffect(() => {
    // Fetch all items from the backend API when component mounts
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/items');
        if (response.ok) {
          const data = await response.json();
          setAllItems(data);
        } else {
          console.error('Failed to fetch items:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchItems();
  }, []);

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

  const handleItemSearch = (text) => {
    setItemSearchText(text);
    if (text.trim() === '') {
      // If search text is empty, clear the matching items
      setMatchingItems([]);
    } else {
      // Filter items based on search text
      const filteredItems = allItems.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setMatchingItems(filteredItems);
    }
  };

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

  const handleItemSelect = (selectedItem) => {
    // Check if the selected item is already in the selected items list
    const isAlreadySelected = selectedItems.some(item => item.name === selectedItem.name);
    if (!isAlreadySelected) {
      // Add selected item to the list of selected items if it's not already selected
      setSelectedItems([...selectedItems, selectedItem]);
    }
    // Clear search text and matching items after item selection
    setItemSearchText('');
    setMatchingItems([]);
  };

  const handleCustomerSelect = (selectedCustomer) => {
    // Set the selected customer
    setSelectedCustomer(selectedCustomer);
    // Clear search text and matching customers after customer selection
    setCustomerSearchText('');
    setMatchingCustomers([]);
  };
  

  const handleRemoveItem = (index) => {
    // Remove item from the list of selected items
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setDate(formattedDate);

    // Your existing code for submitting the transaction
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div>
      <h2>Create Transaction</h2>
      <form onSubmit={handleSubmit}>
        
        <div>
          <label htmlFor="type">Type:</label>
          <select id="type" value={type} onChange={handleTypeChange}>
            <option value="selling">Selling (to customer)</option>
            <option value="buying">Buying (from customer)</option>
          </select>
        </div>

        <div>
          <label htmlFor="search">Search Item:</label>
          <input
            type="text"
            id="search"
            value={itemSearchText}
            onChange={(e) => handleItemSearch(e.target.value)}
          />
          {itemSearchText.trim() !== '' && (
            <ul>
              {matchingItems.map((item, index) => (
                <li key={index} onClick={() => handleItemSelect(item)}>
                  {item.name} - Remaining Quantity: {item.remainingQuantity}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Selected Items:</h3>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item.name} - Remaining Quantity: {item.remainingQuantity}
                <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

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
                  {customer.customerName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Selected Customer:</h3>
          <p>{selectedCustomer ? "Customer Name = " + selectedCustomer.customerName+  "  Customer Number = " +selectedCustomer.customerNumber : 'No customer selected'}</p>
        </div>


        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
}

export default CreateTransaction;
