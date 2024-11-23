import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CreateTransaction() {
  const [type, setType] = useState('selling');
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

  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [accountSearchText, setAccountSearchText] = useState('');
  const [allAccounts, setAllAccounts] = useState([]);
  const [matchingAccounts, setMatchingAccounts] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [Description, setDescription] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
    // Fetch all accounts from the backend API when component mounts
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/accounts');
        if (response.ok) {
          const data = await response.json();
          setAllAccounts(data);
        } else {
          console.error('Failed to fetch items:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAccountSelect = (selectedAccount) => {
    const isAlreadySelected = selectedAccounts.some(account => account.id === selectedAccount.id);
    if (!isAlreadySelected) {
      const updatedSelectedAccounts = [...selectedAccounts, { ...selectedAccount, amount:0 }];
      setSelectedAccounts(updatedSelectedAccounts);
    }
    setItemSearchText('');
    setMatchingItems([]);
  };
  const handleAccountSearch = (text) => {
    setAccountSearchText(text);
    if (text.trim() === '') {
      // If search text is empty, clear the matching items
      setMatchingAccounts([]);
    } else {
      // Filter items based on search text
      const filteredAccounts = allAccounts.filter(account =>
        account.accountName.toLowerCase().includes(text.toLowerCase())
      );
      setMatchingAccounts(filteredAccounts);
    }
  };

  const handleRemoveAccount = (index) => {
    // Remove item from the list of selected items
    const updatedAccounts = [...selectedAccounts];
    updatedAccounts.splice(index, 1);
    setSelectedAccounts(updatedAccounts);
  };



  useEffect(() => {
    // Fetch all items from the backend API when component mounts
    const fetchInvoiceNumber = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/transactions/topTransaction');
        if (response.ok) {
          const data = await response.json();
          setInvoiceNumber(data.transactionNumber+1);
        } else {
          console.error('Failed to fetch invoice number:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchInvoiceNumber();
  }, []);


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

  const calculateRemainingAmount = () => {
    const totalAmount = calculateTotalAmount();
    const totalAccountAmount = selectedAccounts.reduce((total, account) => {
      return total + parseFloat(account.amount || 0); // Parse amount as a number
    }, 0);
    return totalAmount - totalAccountAmount;
  };
  
  const calculateAmountReceived = () => {
    return selectedAccounts.reduce((total, account) => {
      return total + parseFloat(account.amount || 0); // Parse amount as a number
    }, 0);
  };
  

  const calculateAmountRecieved = () => {
    const totalAmount = calculateTotalAmount();
    const totalAccountAmount = selectedAccounts.reduce((total, account) => {
      return total + account.amount;
    }, 0);
    return totalAccountAmount;
    //amountReceived;
      
  };
  
  

  useEffect(() => {
    // Calculate the total amount whenever selectedItems, amountReceived, or selectedAccounts change
    const totalAmount = calculateTotalAmount();
    const totalAccountAmount = selectedAccounts.reduce((total, account) => {
      return total + account.amount;
    }, 0);
    console.log('Total Amount:', totalAmount);
  }, [selectedItems, amountReceived, selectedAccounts]);
  

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
      // Filter customers based on search text (name or phone number)
      const filteredCustomers = allCustomers.filter(customer =>
        customer.customerName.toLowerCase().includes(text.toLowerCase()) ||
        customer.customerNumber.includes(text)
      );
      setMatchingCustomers(filteredCustomers);
    }
  };

  const handleItemSelect = (selectedItem) => {
    const isAlreadySelected = selectedItems.some(item => item.name === selectedItem.name);
    if (!isAlreadySelected) {
      const updatedSelectedItems = [...selectedItems, { ...selectedItem, pricePerUnit: '', quantityToPurchase: 0 }];
      setSelectedItems(updatedSelectedItems);
    }
    setItemSearchText('');
    setMatchingItems([]);
  };
  
  // const handleQuantityToPurchaseChange = (index, value) => {
  //   const updatedSelectedItems = [...selectedItems];
  //   updatedSelectedItems[index].quantityToPurchase = value;

  //   // Adjust remaining quantity based on transaction type
  //   const remainingQuantity = updatedSelectedItems[index].remainingQuantity;
  //   const purchaseQuantity = value || 0;
  //   updatedSelectedItems[index].remainingQuantity = type === 'buying' ? remainingQuantity + purchaseQuantity : remainingQuantity - purchaseQuantity;
  //   setSelectedItems(updatedSelectedItems);
  // };
  const handleQuantityToPurchaseChange = (index, value) => {
    const updatedSelectedItems = [...selectedItems];
    const quantityToPurchase = parseFloat(value) || 0; // Parse input as a float, fallback to 0 if invalid
  
    const item = updatedSelectedItems[index];
    const originalRemainingQuantity = item.originalRemainingQuantity || item.remainingQuantity;
  
    // Update remainingQuantity based on type
    const remainingQuantity = type === 'buying' 
      ? originalRemainingQuantity + quantityToPurchase 
      : originalRemainingQuantity - quantityToPurchase;
  
    updatedSelectedItems[index] = {
      ...item,
      quantityToPurchase, 
      remainingQuantity: parseFloat(remainingQuantity.toFixed(6)), // Keep precision under control
      originalRemainingQuantity // Ensure original value is preserved
    };
  
    setSelectedItems(updatedSelectedItems);
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
    updatedSelectedItems[index].pricePerUnit = value || 0;
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
    const transactionAccounts = selectedAccounts.map(account => ({
      accountName: account.accountName,
      amount : account.amount
    }));

    const raw = JSON.stringify({
      customerNumber: selectedCustomer.customerNumber,
      transactionType: type,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      paymentMethod: paymentMethod,
      receivedBy: receivedBy,
      amountReceived: calculateAmountRecieved(),
      totalAmount: calculateTotalAmount(),
      transactionItems: transactionItems,
      transactionAccounts: transactionAccounts,
      Description : Description
    });


    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:8080/api/transactions", requestOptions);
      if (response.ok) {
        const result = await response.text();
        console.log(result);
        // Show success message to user
        alert("Transaction created successfully!");
        navigate(`/search-transaction/${invoiceNumber}`);
        // You can also reset the form or perform any other necessary action here
      } else {
        // Handle error response
        alert("Failed to create transaction. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      // Handle network error
      alert("Network error. Please check your internet connection and try again.");
    }
  };
  


  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleReceivedByChange = (e) => {
    setReceivedBy(e.target.value);
  };

  const handleDescriptionChange = (e) =>{
    setDescription(e.target.value);
  }

  const handleSubmitAndPrint = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const transactionItems = selectedItems.map(item => ({
      itemName: item.name,
      unitPrice: item.pricePerUnit,
      quantity: item.quantityToPurchase
    }));
    const transactionAccounts = selectedAccounts.map(account => ({
      accountName: account.accountName,
      amount : account.amount
    }));

    const raw = JSON.stringify({
      customerNumber: selectedCustomer.customerNumber,
      transactionType: type,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      paymentMethod: paymentMethod,
      receivedBy: receivedBy,
      amountReceived: calculateAmountRecieved(),
      totalAmount: calculateTotalAmount(),
      transactionItems: transactionItems,
      transactionAccounts: transactionAccounts,
      Description : Description
    });


    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:8080/api/transactions", requestOptions);
      if (response.ok) {
        const result = await response.text();
        console.log(result);
        // Show success message to user
        alert("Transaction created successfully!");
        navigate(`/search-transaction/${invoiceNumber}`);
        // You can also reset the form or perform any other necessary action here
      } else {
        // Handle error response
        alert("Failed to create transaction. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      // Handle network error
      alert("Network error. Please check your internet connection and try again.");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>CREATE BILL</h2>

      <div>
    <label htmlFor="transactionType">Transaction Type:</label>
    <select id="transactionType" defaultValue={type} onChange={(e) => setType(e.target.value)}>
      <option  value="selling">Selling (to customer)</option>
      <option value="buying">Buying (from vendor)</option>
    </select>
  </div>

      {/* Customer Information */}
      <div style={{ marginBottom: '20px' }}>
  <h3>{type === 'selling' ? 'Customer Information' : 'Vendor Information'}</h3>
  {!selectedCustomer ? (
    <>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="search">{type === 'selling' ? 'Search Customer:' : 'Search Vendor:'}</label>
        <input
          type="text"
          id="search"
          value={customerSearchText}
          onChange={(e) => handleCustomerSearch(e.target.value)}
        />
      </div>
      {customerSearchText.trim() !== '' && (
        <ul>
          {matchingCustomers.map((customer, index) => (
            <li
              key={index}
              onClick={() => handleCustomerSelect(customer)}
              style={{ cursor: 'pointer' }}
            >
              {`${customer.customerName} ${customer.customerNumber}`}
            </li>
          ))}
        </ul>
      )}
    </>
  ) : (
    <div style={{ marginBottom: '10px' }}>
      <p>{type === 'selling' ? 'Customer Name:' : 'Vendor Name:'} {selectedCustomer.customerName}</p>
      <p>{type === 'selling' ? 'Customer Number:' : 'Vendor Number:'} {selectedCustomer.customerNumber}</p>
      <button onClick={() => {
        setSelectedCustomer(null);
        setCustomerSearchText('');
      }}>Clear Selection</button>
    </div>
  )}
</div>


<div style={{ marginBottom: '10px' }}>
  <p>Invoice Number: {invoiceNumber}</p>
</div>

<div>
      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        value={Description}
        onChange={handleDescriptionChange}
      />
  </div>


      {/* Items Table */}
<div style={{ marginBottom: '20px' }}>
  <h3>Items</h3>
  <div style={{ marginBottom: '10px' }}>
    <label htmlFor="itemSearch">Search Item:</label>
    <input
      type="text"
      id="itemSearch"
      value={itemSearchText}
      onChange={(e) => handleItemSearch(e.target.value)}
    />
  </div>
  {itemSearchText.trim() !== '' && (
    <ul>
      {matchingItems.map((item, index) => (
        <li key={index} onClick={() => handleItemSelect(item)}
          style={{ cursor: 'pointer' }}
        >
          {item.name} - Remaining Quantity: {item.remainingQuantity}
        </li>
      ))}
    </ul>
  )}
  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', textAlign: 'center' }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sr No</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Description</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Remaining Quantity</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Purchase Quantity</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price per unit</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Remove</th> {/* New column for remove button */}
      </tr>
    </thead>
    <tbody>
      {selectedItems.map((item, index) => (
        <tr key={index}>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.name}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.remainingQuantity}</td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
            <input
              // type="number"
              // value={item.quantityToPurchase || ''}
              // onChange={(e) => {
              //   const newQuantity = e.target.value === '' || isNaN(e.target.value) ? 0 : e.target.value;
              //   const initialRemainingQuantity = type === 'buying' ? item.remainingQuantity - item.quantityToPurchase : item.remainingQuantity + item.quantityToPurchase;
              //   const updatedItems = selectedItems.map((selectedItem, i) => {
              //     if (i === index) {
              //       return {
              //         ...selectedItem,
              //         quantityToPurchase: newQuantity,
              //         remainingQuantity: initialRemainingQuantity + (type === 'buying' ? newQuantity : -newQuantity)
              //       };
              //     }
              //     return selectedItem;
              //   });
              //   setSelectedItems(updatedItems);
              // }}
              type="number"
              value={selectedItems[index].quantityToPurchase}
              onChange={(e) => handleQuantityToPurchaseChange(index, e.target.value)}
            />
          </td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
            <input
              type="number"
              value={item.pricePerUnit}
              onChange={(e) => handlePricePerUnitChange(index, e.target.value)}
            />
          </td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
            {item.pricePerUnit && item.quantityToPurchase && item.pricePerUnit * item.quantityToPurchase}
          </td>
          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
            <button onClick={() => handleRemoveItem(index)}>X</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


{/* Accounts Table */}
<div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <h3>Accounts</h3>
  <div style={{ marginBottom: '10px' }}>
    <label htmlFor="accountSearch">Search Account:</label>
    <input
      type="text"
      id="accountSearch"
      value={accountSearchText}
      onChange={(e) => handleAccountSearch(e.target.value)}
    />
  </div>
  {accountSearchText.trim() !== '' && (
    <ul>
      {matchingAccounts.map((account, index) => (
        <li key={index} onClick={() => handleAccountSelect(account)}
          style={{ cursor: 'pointer' }}
        >
          {account.accountName}
        </li>
      ))}
    </ul>
  )}
 
 <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
  <h3>Selected Accounts</h3>
  {selectedAccounts.map((account, index) => (
    <div key={index} style={{ marginBottom: '10px' }}>
      <span>{account.accountName}</span>
      <input
        type="number"
        value={account.amount}
        onChange={(e) => {
          const updatedAccounts = selectedAccounts.map((selectedAccount, i) => {
            if (i === index) {
              return {
                ...selectedAccount,
                amount: e.target.value
              };
            }
            return selectedAccount;
          });
          setSelectedAccounts(updatedAccounts);
        }}
      />
      <button onClick={() => handleRemoveAccount(index)}>X</button>
      
    </div>
  ))}
</div>

</div>



      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div style={{ width: '50%', textAlign: 'right' }}>
          <p>Total Amount: {calculateTotalAmount()}</p>
          
          <p>Balance: {calculateRemainingAmount()}</p>
        </div>
      </div>


      {/* Submit Button */}
      <div style={{ textAlign: 'center' }}>
      <button type="submit" onClick={handleSubmit}>Create Transaction</button>
      {/*<button type="submit" onClick={handleSubmitAndPrint}>Print Transaction</button>*/}
      </div>
    </div>
  );
}

export default CreateTransaction;
