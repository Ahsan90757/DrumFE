import React, { useState, useEffect } from 'react';

function CreateTransaction() {
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
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

  const calculateItemTotal = (pricePerUnit, quantityToPurchase) => {
    return pricePerUnit * quantityToPurchase;
  };

  // Function to calculate the total amount for all selected items
  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      return total + calculateItemTotal(item.pricePerUnit, item.quantityToPurchase);
    }, 0);
  };

  // Function to calculate the remaining or overpayment amount
  const calculateRemainingAmount = () => {
    const totalAmount = calculateTotalAmount();
    return amountReceived - totalAmount;
  };

  useEffect(() => {
    // Calculate the total amount whenever selectedItems or amountReceived change
    const totalAmount = calculateTotalAmount();
    console.log('Total Amount:', totalAmount);
  }, [selectedItems, amountReceived]);

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
      // Add selected item to the list of selected items with initial price per unit and quantity to purchase
      const updatedSelectedItems = [...selectedItems, { ...selectedItem, pricePerUnit: '', quantityToPurchase: '' }];
      setSelectedItems(updatedSelectedItems);
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
  

  const handlePricePerUnitChange = (index, value) => {
    // Update the price per unit for the item at the specified index in the selected items list
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index].pricePerUnit = value;
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityToPurchaseChange = (index, value) => {
    // Update the quantity to purchase for the item at the specified index in the selected items list
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index].quantityToPurchase = value;
    setSelectedItems(updatedSelectedItems);
  };

  const handleRemoveItem = (index) => {
    // Remove item from the list of selected items
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const transactionItems = selectedItems.map(item => ({
      itemName: item.name,
      unitPrice: item.pricePerUnit,
      quantity: item.quantityToPurchase
    }));

    const raw = JSON.stringify({
      customerNumber: selectedCustomer.customerNumber,
      transactionType: type,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      paymentMethod: paymentMethod,
      receivedBy: receivedBy,
      amountReceived: amountReceived,
      totalAmount: calculateTotalAmount(),
      transactionItems: transactionItems
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:8080/api/transactions", requestOptions);
      const result = await response.text();
      console.log(result);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };


  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleAmountReceivedChange = (e) => {
    setAmountReceived(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleReceivedByChange = (e) => {
    setReceivedBy(e.target.value);
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
                <div>
                  <label htmlFor={`pricePerUnit-${index}`}>Price per Unit:</label>
                  <input
                    type="number"
                    id={`pricePerUnit-${index}`}
                    value={item.pricePerUnit}
                    onChange={(e) => handlePricePerUnitChange(index, e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={`quantityToPurchase-${index}`}>Quantity to Purchase:</label>
                  <input
                    type="number"
                    id={`quantityToPurchase-${index}`}
                    value={item.quantityToPurchase}
                    onChange={(e) => handleQuantityToPurchaseChange(index, e.target.value)}
                  />
                </div>
                {item.pricePerUnit && item.quantityToPurchase && (
                  <p>Total Amount for this Item: {item.pricePerUnit * item.quantityToPurchase}</p>
                )}
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
                  {customer.customerName + "  " + customer.customerNumber}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Selected Customer:</h3>
          <p>{selectedCustomer ? "Customer Name = " + selectedCustomer.customerName+  "  Customer Number = " +selectedCustomer.customerNumber : 'No customer selected'}</p>
        </div>

        <h3>Total :</h3>
        <div>
          <label htmlFor="amountReceived">Amount Received:</label>
          <input
            type="number"
            id="amountReceived"
            value={amountReceived}
            onChange={handleAmountReceivedChange}
          />
        </div>
        <div>
          <p>Total Amount: {calculateTotalAmount()}</p>
          {amountReceived && (
            <p>
              {calculateRemainingAmount() <= 0 ? 'Remaining Amount:' : 'Extra Amount Paid:'} {Math.abs(calculateRemainingAmount())}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Bank">Bank</option>
          </select>
          {paymentMethod === 'Cash' && (
            <div>
              <label htmlFor="receivedBy">Received By:</label>
              <input
                type="text"
                id="receivedBy"
                value={receivedBy}
                onChange={handleReceivedByChange}
              />
            </div>
          )}
          {paymentMethod === 'Bank' && (
            <div>
              <label htmlFor="accountName">Account Name:</label>
              <input
                type="text"
                id="accountName"
                value={receivedBy}
                onChange={handleReceivedByChange}
              />
            </div>
          )}
        </div>

        <button type="submit">Create Transaction</button>
      </form>
    </div>
  );
}

export default CreateTransaction;
