import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import CreateItem from './CreateItem.js';
import CreateCustomer from './CreateCustomer';
import CreateTransaction from './CreateTransaction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/create-transaction" element={<CreateTransaction />} />
      </Routes>
    </Router>
  );
}


export default App;
