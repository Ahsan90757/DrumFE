import React, { useState } from 'react';

function CreateItem() {
  const [itemName, setItemName] = useState('');
  const [remainingQuantity, setRemainingQuantity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "name": itemName,
      "remainingQuantity": parseInt(remainingQuantity)
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:8080/api/items", requestOptions);
      if (response.ok) {
        setMessage('Item successfully created.');
      } else if (response.status === 409) {
        setMessage('Item already exists.');
      } else {
        setMessage('Error creating item.');
      }
    } catch (error) {
      console.error('Error:', error);
      // setMessage('Error creating item.');
    }
  };

  return (
    <div>
      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="remainingQuantity">Remaining Quantity:</label>
          <input
            type="number"
            id="remainingQuantity"
            value={remainingQuantity}
            onChange={(e) => setRemainingQuantity(e.target.value)}
          />
        </div>
        <button type="submit">Create Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateItem;
