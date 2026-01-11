import React, { useState } from 'react';

const Settings = ({
    currency,
    onUpdateCurrency,
    newCategory,
    setNewCategory,
    onAddCategory,
    categories
}) => {
    const currencies = ['₹', '$', '€', '£', '¥'];

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Settings</h2>

            <div className="settings-section">
                <h3>Currency</h3>
                <div className="currency-selector">
                    {currencies.map(curr => (
                        <button
                            key={curr}
                            className={`currency-btn ${currency === curr ? 'active' : ''}`}
                            onClick={() => onUpdateCurrency(curr)}
                        >
                            {curr}
                        </button>
                    ))}
                </div>
            </div>

            <div className="settings-section">
                <h3>Manage Categories</h3>
                <div className="add-category-input">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                    />
                    <button onClick={handleAddCategory} className="add-btn">Add</button>
                </div>
                <div className="categories-list">
                    {categories.map(cat => (
                        <span key={cat} className="category-tag">{cat}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
