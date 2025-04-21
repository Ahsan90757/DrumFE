import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ItemDashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [selectedTransactionLimit, setSelectedTransactionLimit] = useState(25);
  const [expandedItem, setExpandedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [remainingBalances, setRemainingBalances] = useState({});
  const [lastPageBalance, setLastPageBalance] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const fetchTransactions = (itemName, page = 0, limit = selectedTransactionLimit) => {
    fetch(`http://localhost:8080/api/transactions/sales/paginated/${itemName}/${page}/${limit}`)
      .then(response => response.json())
      .then(data => {
        setTransactions(prev => ({ ...prev, [itemName]: { data, page } }));

        let initialBalance = page === 0 
          ? items.find(i => i.name === itemName)?.remainingQuantity || 0 
          : lastPageBalance[itemName] || 0;

        let runningBalance = initialBalance;
        let transactionsList = Object.values(data).flat();

        transactionsList.forEach(transaction => {
          runningBalance -= transaction.quantity;
        });

        setRemainingBalances(prev => ({ ...prev, [itemName]: initialBalance }));
        setLastPageBalance(prev => ({ ...prev, [itemName]: runningBalance }));
      })
      .catch(error => console.error('Error fetching transactions:', error));
  };

  useEffect(() => {
    if (expandedItem) {
      fetchTransactions(expandedItem, currentPage, selectedTransactionLimit);
    }
  }, [selectedTransactionLimit, currentPage]);

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : Math.max(currentPage - 1, 0);
    setCurrentPage(newPage);
  };

  const toggleTransactions = (itemName) => {
    if (expandedItem === itemName) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemName);
      setCurrentPage(0); // Reset page when opening new item
      fetchTransactions(itemName, 0, selectedTransactionLimit);
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
            <th>Name</th>
            <th>Remaining Quantity</th>
            <th>Recent Transactions</th>
          </tr>
        </thead>
        
        <tbody>
          {items.map(item => (
            <React.Fragment key={item.name}>
              <tr>
                <td>{item.name}</td>
                <td>{item.remainingQuantity}</td>
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
                          {(() => {
                            let runningBalance = remainingBalances[item.name] ?? item.remainingQuantity;

                            return Object.entries(transactions[item.name]?.data || {}).map(([date, transList]) => (
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
                            ));
                          })()}
                        </tbody>
                      </table>

                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <button
                          onClick={() => handlePageChange('previous')}
                          disabled={currentPage <= 0}
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
