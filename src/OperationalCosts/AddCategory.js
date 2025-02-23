import { useState } from 'react';

function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() !== '') {
      setSubcategories([...subcategories, newSubcategory]);
      setNewSubcategory('');
    }
  };

  const handleSubmit = async () => {
    const categoryData = {
      name: categoryName,
      subcategories: subcategories, // This sends subcategories (empty or filled)
    };

    try {
      const response = await fetch('http://localhost:8080/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        alert('Category added successfully!');
      } else {
        alert('Failed to add category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div>
      <h2>Add New Category</h2>
      
      <input 
        type="text" 
        placeholder="Category Name" 
        value={categoryName} 
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <h3>Subcategories</h3>
      {subcategories.map((sub, index) => (
        <p key={index}>{sub}</p>
      ))}

      <input 
        type="text" 
        placeholder="Add Subcategory" 
        value={newSubcategory} 
        onChange={(e) => setNewSubcategory(e.target.value)}
      />
      <button onClick={handleAddSubcategory}>Add Subcategory</button>

      <button onClick={handleSubmit}>Submit Category</button>
    </div>
  );
}

export default AddCategory;
