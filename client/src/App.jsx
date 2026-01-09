import { useState, useEffect } from 'react'
import axios from 'axios'
import AddExpenseForm from './components/AddExpenseForm'
import ExpenseList from './components/ExpenseList'
import './App.css'

const API_URL = 'http://localhost:5001/api/expenses';

function App() {
    const [expenses, setExpenses] = useState([])

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(API_URL);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAddExpense = async (expense) => {
        try {
            const response = await axios.post(API_URL, expense);
            setExpenses([...expenses, response.data]);
        } catch (error) {
            console.error('Error adding expense:', error);
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

    return (
        <div className="app-container">
            <h1>Expense Tracker</h1>
            <AddExpenseForm onAdd={handleAddExpense} />
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
        </div>
    )
}

export default App
