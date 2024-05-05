import React, { useState } from 'react';

function SearchAndDeleteItem() {
  const [itemName, setItemName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/items/name/${itemName}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResult(data);
      } else {
        setSearchResult(null);
        setDeleteMessage('Item not found.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSearchResult(null);
      setDeleteMessage('Error searching for item.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/items/${itemName}`, { method: 'DELETE' });

      if (response.ok) {
        setSearchResult(null);
        setDeleteMessage('Item deleted successfully.');
      } else {
        setDeleteMessage('Error deleting item.');
      }
    } catch (error) {
      console.error('Error:', error);
      setDeleteMessage('Error deleting item.');
    }
  };

  return (
    <div>
      <h2>Search and Delete Item</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <button type="submit">Search Item</button>
      </form>
      {searchResult && (
        <div>
          <p>Name: {searchResult.name}</p>
          <p>Remaining Quantity: {searchResult.remainingQuantity}</p>
          <button onClick={handleDelete}>Delete Item</button>
        </div>
      )}
      {deleteMessage && <p>{deleteMessage}</p>}
    </div>
  );
}

export default SearchAndDeleteItem;
