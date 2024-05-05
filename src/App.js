import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CreateItem from './Item/CreateItem';
import DeleteItem from './Item/DeleteItem';
import CreateCustomer from './Customer/CreateCustomer';
import CreateTransaction from './Transaction/CreateTransaction';
import DeleteCustomer from './Customer/DeleteCustomer';
import ItemDashboard from './Item/ItemDashboard';
import CustomerDashboard from './Customer/CustomerDashboard';
import TransactionDashboard from './Transaction/TransactionDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ITEM ROUTES */}
        <Route path="/item-dashboard" element={<ItemDashboard />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/delete-item" element={<DeleteItem />} />
        
        {/* CUSTOMER ROUTES */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/delete-customer" element={<DeleteCustomer />} />
        
        {/* TRANSACTION ROUTES */}
        <Route path="/transaction-dashboard" element={<TransactionDashboard />} />
        <Route path="/create-transaction" element={<CreateTransaction />} />

     
      </Routes>
    </Router>
  );
}


export default App;