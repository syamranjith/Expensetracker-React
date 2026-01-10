import { useState, useEffect } from 'react'
import axios from 'axios'
import AddExpenseForm from './components/AddExpenseForm'
import ExpenseList from './components/ExpenseList'
import Settings from './components/Settings'
import Reports from './components/Reports'
import './App.css'

const API_URL = 'http://localhost:5001/api/expenses';
const CATEGORIES_API_URL = 'http://localhost:5001/api/categories';
const SETTINGS_API_URL = 'http://localhost:5001/api/settings';

function App() {
    const [expenses, setExpenses] = useState([])
    const [categories, setCategories] = useState([])
    const [editingExpense, setEditingExpense] = useState(null)
    const [currency, setCurrency] = useState('₹'); // Default currency
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(API_URL);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORIES_API_URL);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(SETTINGS_API_URL);
            if (response.data.currency) {
                setCurrency(response.data.currency);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchSettings();
    }, []);

    const handleAddExpense = async (expense) => {
        try {
            const response = await axios.post(API_URL, expense);
            setExpenses([...expenses, response.data]);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleUpdateExpense = async (updatedExpense) => {
        try {
            const response = await axios.put(`${API_URL}/${updatedExpense.id}`, updatedExpense);
            setExpenses(expenses.map(e => e.id === updatedExpense.id ? response.data : e));
            setEditingExpense(null);
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleAddCategory = async (catName) => {
        try {
            const response = await axios.post(CATEGORIES_API_URL, { category: catName });
            setCategories(response.data);
        } catch (error) {
            console.error('Error adding category:', error);
            alert("Failed to add category. It might already exist.");
        }
    };

    const handleUpdateCurrency = async (newCurrency) => {
        try {
            await axios.post(SETTINGS_API_URL, { currency: newCurrency });
            setCurrency(newCurrency);
        } catch (error) {
            console.error('Error updating currency:', error);
        }
    };

    const handleViewReports = () => {
        setIsSettingsOpen(false);
        setIsReportsOpen(true);
    };

    return (
        <div className="app-container">
            <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0 }}>Expense Tracker</h1>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px' }}
                    title="Settings"
                >
                    ⚙️
                </button>
            </div>

            <AddExpenseForm
                onAdd={handleAddExpense}
                onUpdate={handleUpdateExpense}
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
                categories={categories}
            />
            <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={setEditingExpense}
                currency={currency}
            />
            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currency={currency}
                onUpdateCurrency={handleUpdateCurrency}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                onAddCategory={handleAddCategory}
                categories={categories}
                onViewReports={handleViewReports}
            />
            {isReportsOpen && (
                <Reports
                    expenses={expenses}
                    currency={currency}
                    onClose={() => setIsReportsOpen(false)}
                />
            )}
        </div>
    )
}

export default App
