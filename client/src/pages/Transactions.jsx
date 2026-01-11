import React, { useState, useMemo } from 'react';
import '../components/ExpenseList.css';

const Transactions = ({ expenses = [], currency = '₹' }) => {
    // Safety Check: Ensure expenses is an array
    if (!expenses || !Array.isArray(expenses)) {
        console.error("Transactions received invalid expenses:", expenses);
        return <div className="page-container" style={{ padding: '20px', color: 'white', textAlign: 'center' }}>Loading transactions...</div>;
    }

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All'); // All, Income, Expense
    const [sortOrder, setSortOrder] = useState('dateDesc'); // dateDesc, dateAsc, amountHigh, amountLow
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Unique Categories for Dropdown
    const categories = useMemo(() => {
        try {
            const cats = new Set(expenses.map(e => e?.category || 'Other'));
            return ['All', ...Array.from(cats).sort()];
        } catch (err) {
            console.error("Error generating categories:", err);
            return ['All'];
        }
    }, [expenses]);

    // Filtering and Sorting Logic
    const filteredExpenses = useMemo(() => {
        try {
            return expenses.filter(expense => {
                if (!expense) return false;

                // Search Filter
                const description = expense.description ? expense.description.toLowerCase() : '';
                const matchesSearch = description.includes(searchTerm.toLowerCase());

                // Category Filter
                const category = expense.category || 'Other';
                const matchesCategory = selectedCategory === 'All' || category === selectedCategory;

                // Type Filter
                const amount = parseFloat(expense.amount || 0);
                const isIncome = amount > 0;
                const matchesType = selectedType === 'All' ||
                    (selectedType === 'Income' && isIncome) ||
                    (selectedType === 'Expense' && !isIncome);

                // Date Range Filter
                let matchesDate = true;
                if (startDate && expense.date) {
                    matchesDate = matchesDate && new Date(expense.date) >= new Date(startDate);
                }
                if (endDate && expense.date) {
                    matchesDate = matchesDate && new Date(expense.date) <= new Date(endDate);
                }

                return matchesSearch && matchesCategory && matchesType && matchesDate;
            }).sort((a, b) => {
                // Sorting
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                const amountA = parseFloat(a.amount || 0);
                const amountB = parseFloat(b.amount || 0);

                switch (sortOrder) {
                    case 'dateDesc': return dateB - dateA;
                    case 'dateAsc': return dateA - dateB;
                    case 'amountHigh': return Math.abs(amountB) - Math.abs(amountA);
                    case 'amountLow': return Math.abs(amountA) - Math.abs(amountB);
                    default: return 0;
                }
            });
        } catch (err) {
            console.error("Error filtering expenses:", err);
            return [];
        }
    }, [expenses, searchTerm, selectedCategory, selectedType, sortOrder, startDate, endDate]);

    // Calculate Totals for Filtered View
    const { totalIncome, totalExpense } = useMemo(() => {
        return filteredExpenses.reduce((acc, curr) => {
            const amt = parseFloat(curr.amount || 0);
            if (amt > 0) acc.totalIncome += amt;
            else acc.totalExpense += amt;
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });
    }, [filteredExpenses]);

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                Transactions ({filteredExpenses.length})
            </h2>

            {/* Filters Panel */}
            <div className="filters-panel" style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
            }}>
                {/* Search */}
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Search</label>
                    <input
                        type="text"
                        placeholder="Search description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                {/* Category */}
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Type */}
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    >
                        <option value="All">All Transactions</option>
                        <option value="Income">Income Only</option>
                        <option value="Expense">Expense Only</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Sort By</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    >
                        <option value="dateDesc">Date (Newest First)</option>
                        <option value="dateAsc">Date (Oldest First)</option>
                        <option value="amountHigh">Amount (Highest First)</option>
                        <option value="amountLow">Amount (Lowest First)</option>
                    </select>
                </div>

                {/* Date Range */}
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>
                <div className="filter-group">
                    <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>
            </div>

            {/* Filtered Summary */}
            <div className="summary-bar" style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                justifyContent: 'space-around'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Filtered Income</div>
                    <div style={{ color: '#00d2d3', fontWeight: 'bold' }}>{currency}{totalIncome.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Filtered Expense</div>
                    <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{currency}{Math.abs(totalExpense).toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Net Balance</div>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>{currency}{(totalIncome + totalExpense).toFixed(2)}</div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="expense-list-container" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div className="table-responsive">
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                                        No transactions match your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense) => {
                                    const amount = parseFloat(expense.amount || 0);
                                    return (
                                        <tr key={expense.id}>
                                            <td>{expense.date}</td>
                                            <td style={{ fontWeight: '500' }}>{expense.description}</td>
                                            <td>
                                                <span className="category-badge">{expense.category || 'Other'}</span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    background: amount > 0 ? 'rgba(0, 210, 211, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                                                    color: amount > 0 ? '#00d2d3' : '#ff6b6b',
                                                    border: `1px solid ${amount > 0 ? 'rgba(0, 210, 211, 0.3)' : 'rgba(255, 107, 107, 0.3)'}`
                                                }}>
                                                    {amount > 0 ? 'Income' : 'Expense'}
                                                </span>
                                            </td>
                                            <td className={amount < 0 ? 'expense-amount' : 'income-amount'}>
                                                {currency}{Math.abs(amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
