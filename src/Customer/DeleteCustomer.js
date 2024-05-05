import React, { useState } from 'react';

function SearchAndDeleteCustomer() {
  const [customerName, setCustomerName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/customers/name/${customerName}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResult(data);
      } else {
        setSearchResult(null);
        setDeleteMessage('Customer not found.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSearchResult(null);
      setDeleteMessage('Error searching for customer.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/customers/${customerName}`, { method: 'DELETE' });

      if (response.ok) {
        setSearchResult(null);
        setDeleteMessage('Customer deleted successfully.');
      } else {
        setDeleteMessage('Error deleting customer.');
      }
    } catch (error) {
      console.error('Error:', error);
      setDeleteMessage('Error deleting customer.');
    }
  };

  return (
    <div>
      <h2>Search and Delete Customer</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <button type="submit">Search Customer</button>
      </form>
      {searchResult && (
        <div>
          <p>Name: {searchResult.customerName}</p>
          <p>Phone Number: {searchResult.customerNumber}</p>
          <button onClick={handleDelete}>Delete Customer</button>
        </div>
      )}
      {deleteMessage && <p>{deleteMessage}</p>}
    </div>
  );
}

export default SearchAndDeleteCustomer;
