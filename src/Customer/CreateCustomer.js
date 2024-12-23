import React, { useState } from 'react';

function CreateCustomer() {
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "customerName": customerName,
      "customerNumber": customerNumber
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("http://localhost:8080/api/customers", requestOptions);
      if (response.ok) {
        setMessage('Customer successfully created.');
      } else if (response.status === 409) {
        setMessage('Customer already exists.');
      } else {
        setMessage('Error creating customer.');
      }
    } catch (error) {
      console.error('Error:', error);
      // setMessage('Error creating customer.');
    }
  };

  return (
    <div>
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="customerNumber">Phone Number:</label>
          <input
            type="text"
            id="customerNumber"
            value={customerNumber}
            onChange={(e) => setCustomerNumber(e.target.value)}
          />
        </div>
        <button type="submit">Create Customer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateCustomer;
