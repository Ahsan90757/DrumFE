// import React, { useEffect, useState } from "react";

// const DailyLedger = () => {
//   const [ledgerEntries, setLedgerEntries] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [transactionsRes, operationalCostsRes] = await Promise.all([
//         fetch("http://localhost:8080/api/transactions"),
//         fetch("http://localhost:8080/api/operational-costs")
//       ]);

//       const transactions = await transactionsRes.json();
//       const operationalCosts = await operationalCostsRes.json();

//       const formattedTransactions = transactions.map((tx) => ({
//         date: new Date(tx.date).toISOString().split("T")[0],
//         name: `Transaction #${tx.transactionNumber} + ${tx.customerNumber}`,
//         credit: tx.transactionType === "buying" ? tx.amountReceived : 0,
//         debit: tx.transactionType === "selling" ? tx.amountReceived : 0
//       }));

//       const formattedOperationalCosts = operationalCosts.map((op) => ({
//         date: new Date(op.date).toISOString().split("T")[0],
//         name: `${op.category}${op.subcategory ? ` > ${op.subcategory}` : ""}`,
//         credit: op.amount,
//         debit: 0
//       }));

//       const combined = [...formattedTransactions, ...formattedOperationalCosts];

//       const sorted = combined.sort((a, b) => new Date(b.date) - new Date(a.date));

//       setLedgerEntries(sorted);
//     } catch (error) {
//       console.error("Error fetching ledger data:", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Daily Ledger</h2>
//       <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Name</th>
//             <th>Credit</th>
//             <th>Debit</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ledgerEntries.map((entry, index) => (
//             <tr key={index}>
//               <td>{entry.date}</td>
//               <td>{entry.name}</td>
//               <td>{entry.credit > 0 ? `${entry.credit.toFixed(2)}` : ""}</td>
//               <td>{entry.debit > 0 ? `${entry.debit.toFixed(2)}` : ""}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DailyLedger;
import React, { useEffect, useState } from "react";

const DailyLedger = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, operationalCostsRes, customersRes] = await Promise.all([
        fetch("http://localhost:8080/api/transactions"),
        fetch("http://localhost:8080/api/operational-costs"),
        fetch("http://localhost:8080/api/customers"),
      ]);

      const transactions = await transactionsRes.json();
      const operationalCosts = await operationalCostsRes.json();
      const customers = await customersRes.json();

      // Map customerNumber to customerName
      const customerMap = {};
      customers.forEach((c) => {
        customerMap[c.customerNumber] = c.customerName;
      });

      // Format transactions
      const formattedTransactions = transactions.map((tx) => {
        const customerName = customerMap[tx.customerNumber] || "Unknown Customer";
        return {
          date: new Date(tx.date).toISOString().split("T")[0],
          name: `${customerName} (#${tx.transactionNumber})`,
          credit: tx.transactionType === "buying" ? tx.totalAmount || 0 : 0,
          debit: tx.transactionType === "selling" ? tx.totalAmount || 0 : 0,
        };
      });

      // Format operational costs
      const formattedOperationalCosts = operationalCosts.map((op) => ({
        date: new Date(op.date).toISOString().split("T")[0],
        name: `${op.category}${op.subcategory ? " > " + op.subcategory : ""}`,
        credit: op.amount || 0,
        debit: 0,
      }));

      // Combine and sort by date
      const combined = [...formattedTransactions, ...formattedOperationalCosts];
      const sorted = combined.sort((a, b) => new Date(b.date) - new Date(a.date));

      setLedgerEntries(sorted);
    } catch (error) {
      console.error("Error fetching ledger data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Daily Ledger</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Credit</th>
            <th>Debit</th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.name}</td>
              <td>{entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : ""}</td>
              <td>{entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyLedger;