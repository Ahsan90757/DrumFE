import React, { useState } from "react";

const TodaysOperationalCost = () => {
  // Hardcoded categories and subcategories
  const categories = {
    Freight: null, // No subcategories
    Wages: ["Ahsan", "Rayyan"], // Subcategories
    Utility: ["Water", "Electricity"], // Subcategories
  };

  // State variables
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [amounts, setAmounts] = useState([]);
  const [amount, setAmount] = useState("");

  // Handlers
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
    setAmount("");
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setAmount("");
  };

  const handleAddAmount = () => {
    if (!selectedCategory || (!categories[selectedCategory]?.length && !amount)) return;

    // Add the amount
    setAmounts((prev) => [
      ...prev,
      {
        category: selectedCategory,
        subcategory: selectedSubcategory || null,
        amount: parseFloat(amount),
      },
    ]);
    setAmount("");
  };

  const calculateTotal = () =>
    amounts.reduce((total, item) => total + item.amount, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Today's Operational Costs</h2>

      {/* Category Dropdown */}
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="category">Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      {selectedCategory && categories[selectedCategory]?.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="subcategory">Subcategory: </label>
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
          >
            <option value="">Select Subcategory</option>
            {categories[selectedCategory].map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Amount Input */}
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="amount">Amount: </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      {/* Add Amount Button */}
      <button onClick={handleAddAmount}>Add Amount</button>

      {/* Display Added Amounts */}
      <div style={{ marginTop: "20px" }}>
        <h3>Added Costs:</h3>
        <ul>
          {amounts.map((item, index) => (
            <li key={index}>
              {item.category} {item.subcategory && `> ${item.subcategory}`} : $
              {item.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Total Cost */}
      <h3>Total: {calculateTotal().toFixed(2)}</h3>
    </div>
  );
};

export default TodaysOperationalCost;
