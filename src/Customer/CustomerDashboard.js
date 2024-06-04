import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('There was an error fetching the customers!', error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };

  const handleDelete = async (customerNumber) => {
    try {
      await fetch(`http://localhost:8080/api/customers/${customerNumber}`, {
        method: 'DELETE',
      });
      fetchCustomers();
    } catch (error) {
      console.error('There was an error deleting the customer!', error);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:8080/api/customers/${editingCustomer.customerNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCustomer),
      });
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('There was an error updating the customer!', error);
    }
  };

  const handleChange = (e) => {
    setEditingCustomer({ ...editingCustomer, [e.target.name]: e.target.value });
  };


  return (
    <div>
      <h2>Customer Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-customer')}>Create a Customer</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/delete-customer')}>Delete a Customer</p>

      <div>
      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>Customer Number</th>
            <th>Name</th>
            <th>Last Transaction</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerNumber}>
              <td>{customer.customerNumber}</td>
              <td>{editingCustomer && editingCustomer.customerNumber === customer.customerNumber ? (
                <input
                  type="text"
                  name="customerName"
                  value={editingCustomer.customerName}
                  onChange={handleChange}
                />
              ) : (
                customer.customerName
              )}</td>
              <td>{new Date(customer.lastTransaction).toLocaleDateString()}</td>
              <td>{customer.balance}</td>
              <td>
                {editingCustomer && editingCustomer.customerNumber === customer.customerNumber ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(customer)}>Edit</button>
                )}
                <button onClick={() => handleDelete(customer.customerNumber)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
}

export default CustomerDashboard;
