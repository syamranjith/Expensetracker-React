import { useState } from 'react';
import './AddExpenseForm.css';

const AddExpenseForm = ({ onAdd }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !date) return;

        onAdd({ description, amount: parseFloat(amount), date });
        setDescription('');
        setAmount('');
        setDate('');
    };

    return (
        <form className="add-expense-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Coffee"
                    required
                />
            </div>
            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    required
                />
            </div>
            <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpenseForm;
