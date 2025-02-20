import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [selectedTransactionLimit, setSelectedTransactionLimit] = useState(25);
  const [expandedItem, setExpandedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const fetchTransactions = (itemName, page = 1, limit = selectedTransactionLimit) => {
    fetch(`http://localhost:8080/api/transactions/sales/paginated/${itemName}/${page}/${limit}`)
      .then(response => response.json())
      .then(data => {
        setTransactions((prev) => ({ ...prev, [itemName]: { data, page } }));
        setExpandedItem(itemName);
      })
      .catch(error => console.error('Error fetching transactions:', error));
  };

  useEffect(() => {
    if (expandedItem) {
      fetchTransactions(expandedItem, currentPage, selectedTransactionLimit);
    }
  }, [selectedTransactionLimit, currentPage]);

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
  };

  const toggleTransactions = (itemName) => {
    if (expandedItem === itemName) {
      setExpandedItem(null); // Collapse if the same item is clicked
    } else {
      setExpandedItem(itemName); // Expand if a new item is clicked
      fetchTransactions(itemName, currentPage, selectedTransactionLimit); // Fetch transactions for the item
    }
  };

  return (
    <div>
      <h2>Item Dashboard</h2>

      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/create-item')}>Create an Item</p>
      <p style={{ cursor: 'pointer' }} onClick={() => navigate('/delete-item')}>Delete Item</p>

      <label>Select Top Transactions:</label>
      <select
        value={selectedTransactionLimit}
        onChange={(e) => setSelectedTransactionLimit(Number(e.target.value))}
      >
        <option value={25}>Top 25</option>
        <option value={50}>Top 50</option>
        <option value={100}>Top 100</option>
      </select>

      <table>
        <thead>
          <tr>
            <th style={{ paddingRight: '50px' }}>Name</th>
            <th style={{ paddingRight: '50px' }}>Remaining Quantity</th>
            <th style={{ paddingRight: '50px' }}>Recent Transactions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <React.Fragment key={item.name}>
              <tr>
                <td style={{ paddingRight: '50px' }}>{item.name}</td>
                <td style={{ paddingRight: '50px' }}>{item.remainingQuantity}</td>
                <td>
                  <button onClick={() => toggleTransactions(item.name)}>
                    {expandedItem === item.name ? 'Hide' : 'Show'} Transactions
                  </button>
                </td>
              </tr>

              {expandedItem === item.name && transactions[item.name] && (
                <tr>
                  <td colSpan="3">
                    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <table border="1" width="100%">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Quantity</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(transactions[item.name]?.data || {}).map(([date, transList]) => {
                            let runningBalance = item.remainingQuantity;

                            return (
                              <React.Fragment key={date}>
                                <tr>
                                  <td colSpan="4" style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                    {date}
                                  </td>
                                </tr>

                                {(Array.isArray(transList) ? transList : []).map((transaction, index) => {
                                  let previousBalance = runningBalance;
                                  runningBalance -= transaction.quantity;

                                  return (
                                    <tr key={index}>
                                      <td></td>
                                      <td>{transaction.customerName}</td>
                                      <td>{transaction.quantity}</td>
                                      <td>{previousBalance.toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Pagination inside the same div */}
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handlePageChange('previous')}
                          disabled={currentPage <= 1}
                        >
                          Previous
                        </button>
                        <span> Page {currentPage} </span>
                        <button
                          onClick={() => handlePageChange('next')}
                          disabled={transactions[expandedItem].data.length < selectedTransactionLimit}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemDashboard;
