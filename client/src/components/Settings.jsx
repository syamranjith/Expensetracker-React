import React, { useState } from 'react';

const Settings = ({
    isOpen,
    onClose,
    currency,
    onUpdateCurrency,
    newCategory,
    setNewCategory,
    onAddCategory,
    categories,
    onViewReports
}) => {
    if (!isOpen) return null;

    const currencies = ['₹', '$', '€', '£', '¥'];

    const handleAddCategory = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="settings-section">
                    <h3>Analyze</h3>
                    <button
                        onClick={onViewReports}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#333',
                            border: '1px solid #555',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        View Spending Reports
                    </button>
                </div>

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
        </div>
    );
};

export default Settings;
