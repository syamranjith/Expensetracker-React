import React, { useState, useMemo } from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete, onEdit, currency }) => {
    const [filterType, setFilterType] = useState('all'); // all, daily, weekly, monthly, yearly

    const filteredExpenses = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const expenseDay = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

            if (filterType === 'daily') {
                return expenseDay.getTime() === today.getTime();
            } else if (filterType === 'weekly') {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
                const lastDayOfWeek = new Date(today);
                lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));
                return expenseDay >= firstDayOfWeek && expenseDay <= lastDayOfWeek;
            } else if (filterType === 'monthly') {
                return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
            } else if (filterType === 'yearly') {
                return expenseDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [expenses, filterType]);

    const { totalIncome, totalExpense } = useMemo(() => {
        return filteredExpenses.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            if (amount > 0) {
                acc.totalIncome += amount;
            } else {
                acc.totalExpense += amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });
    }, [filteredExpenses]);

    return (
        <div className="expense-list-container">
            <div className="filters-container">
                {['all', 'daily', 'weekly', 'monthly', 'yearly'].map(type => (
                    <button
                        key={type}
                        className={`filter-btn ${filterType === type ? 'active' : ''}`}
                        onClick={() => setFilterType(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="summary-cards">
                <div className="summary-card income">
                    <h4>Income</h4>
                    <p>{currency}{totalIncome.toFixed(2)}</p>
                </div>
                <div className="summary-card expense">
                    <h4>Expense</h4>
                    <p>{currency}{Math.abs(totalExpense).toFixed(2)}</p>
                </div>
                <div className="summary-card balance">
                    <h4>Balance</h4>
                    <p>{currency}{(totalIncome + totalExpense).toFixed(2)}</p>
                </div>
            </div>

            <div className="table-responsive">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No transactions found for this period.</td>
                            </tr>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.date}</td>
                                    <td>{expense.description}</td>
                                    <td>
                                        <span className="category-badge">{expense.category || 'Other'}</span>
                                    </td>
                                    <td className={expense.amount < 0 ? 'expense-amount' : 'income-amount'}>
                                        {currency}{parseFloat(expense.amount).toFixed(2)}
                                    </td>
                                    <td>
                                        <button className="edit-btn" onClick={() => onEdit(expense)}>Edit</button>
                                        <button className="delete-btn" onClick={() => onDelete(expense.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
