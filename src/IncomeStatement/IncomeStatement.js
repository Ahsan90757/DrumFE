import React, { useState, useEffect } from 'react';
function IncomeStatement() {
    const [transactions, setTransactions] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [grossProfit, setGrossProfit] = useState(0);
    const [operationsTransactions, setOperationsTransactions] = useState([]);
    const [totalOperationalCost, setTotalOperationalCost] = useState(0);
    const [totalProfitBeforeTax, setTotalProfitBeforeTax] = useState(0);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch('http://localhost:8080/api/transactions');
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }

        fetchTransactions();
    }, []);

    useEffect(() => {
        const sellingTransactions = transactions.filter(transaction => transaction.transactionType === 'selling');
        const buyingTransactions = transactions.filter(transaction => transaction.transactionType === 'buying');
        const operationsTransactions = transactions.filter(transaction => transaction.transactionType === 'operations');

        const totalSalesAmount = sellingTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
        const totalCostAmount = buyingTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
        const grossProfitAmount = totalSalesAmount - totalCostAmount;

        const totalOperationalCostAmount = operationsTransactions.reduce((sum, transaction) => {
            return sum + transaction.transactionItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
        }, 0);
        const totalProfitBeforeTaxAmount = grossProfitAmount - totalOperationalCostAmount;

        setTotalSales(totalSalesAmount);
        setTotalCost(totalCostAmount);
        setGrossProfit(grossProfitAmount);
        setOperationsTransactions(operationsTransactions);
        setTotalOperationalCost(totalOperationalCostAmount);
        setTotalProfitBeforeTax(totalProfitBeforeTaxAmount);

    }, [transactions]);

    return (
        <div>
          <p>Total Sales: {totalSales}</p>
          <p>Total Cost: {totalCost}</p>
          <p>Gross Profit: {grossProfit}</p>
          
    
          <h2>Operations Transactions</h2>
          {operationsTransactions.length > 0 ? (
            operationsTransactions.map((transaction, index) => (
              <div key={index}>
                <ul>
                  {transaction.transactionItems.map((item, idx) => (
                    <li key={idx}>
                     {item.itemName}: {(-item.totalPrice)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No operations transactions found.</p>
          )}
          <p>Total Operational Cost: {totalOperationalCost}</p>
          <p>Total Profit Before Tax: {totalProfitBeforeTax}</p>
        </div>
      );
    }
    
export default  IncomeStatement;