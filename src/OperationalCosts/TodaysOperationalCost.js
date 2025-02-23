import React, { useState, useEffect } from "react";

const TodaysOperationalCost = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [amounts, setAmounts] = useState([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories"); // Adjust URL as needed
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
    if (!selectedCategory || (!categories.find(cat => cat.name === selectedCategory)?.subcategories?.length && !amount)) return;

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
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      {selectedCategory &&
        categories.find(cat => cat.name === selectedCategory)?.subcategories?.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="subcategory">Subcategory: </label>
            <select id="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
              <option value="">Select Subcategory</option>
              {categories
                .find(cat => cat.name === selectedCategory)
                ?.subcategories.map((subcat, index) => (
                  <option key={index} value={subcat}>
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
              {item.category} {item.subcategory && `> ${item.subcategory}`} : ${item.amount.toFixed(2)}
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
