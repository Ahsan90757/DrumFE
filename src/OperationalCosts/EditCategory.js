import React, { useState, useEffect } from "react";

const EditCategory = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [updatedCategoryName, setUpdatedCategoryName] = useState("");
    const [updatedSubcategories, setUpdatedSubcategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategoryId(category.id);
        setUpdatedCategoryName(category.name);
        setUpdatedSubcategories(category.subcategories ? [...category.subcategories] : []);
    };

    const handleUpdate = async () => {
        try {
            await fetch(`http://localhost:8080/api/categories/${editingCategoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: updatedCategoryName,
                    subcategories: updatedSubcategories,
                }),
            });
            setEditingCategoryId(null);
            fetchCategories(); // Refresh categories after update
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleSubcategoryChange = (index, value) => {
        const newSubcategories = [...updatedSubcategories];
        newSubcategories[index] = value;
        setUpdatedSubcategories(newSubcategories);
    };

    const handleAddSubcategory = () => {
        setUpdatedSubcategories([...updatedSubcategories, ""]);
    };

    return (
        <div>
            <h2>Edit Categories</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {editingCategoryId === category.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={updatedCategoryName}
                                    onChange={(e) => setUpdatedCategoryName(e.target.value)}
                                />
                                <h4>Subcategories:</h4>
                                <ul>
                                    {updatedSubcategories.map((sub, index) => (
                                        <li key={index}>
                                            <input
                                                type="text"
                                                value={sub}
                                                onChange={(e) =>
                                                    handleSubcategoryChange(index, e.target.value)
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={handleAddSubcategory}>+ Add Subcategory</button>
                                <br />
                                <button onClick={handleUpdate}>Save</button>
                                <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <span>{category.name}</span>
                                <button onClick={() => handleEdit(category)}>Edit</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditCategory;
