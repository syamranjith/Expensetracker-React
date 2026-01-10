import { useState, useEffect } from 'react';
import './AddExpenseForm.css';

const AddExpenseForm = ({ onAdd, onUpdate, editingExpense, setEditingExpense, categories = [] }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Other');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingExpense) {
            setDescription(editingExpense.description);
            setAmount(editingExpense.amount);
            setDate(editingExpense.date);
            setCategory(editingExpense.category || 'Other');
        } else {
            resetForm();
        }
    }, [editingExpense]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('Other');
        setErrors({});
    };

    const validate = () => {
        const newErrors = {};
        if (!description.trim()) newErrors.description = true;
        if (!amount || parseFloat(amount) <= 0) newErrors.amount = true;
        if (!date) newErrors.date = true;
        if (!category) newErrors.category = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        if (editingExpense) {
            onUpdate({ ...editingExpense, description, amount: parseFloat(amount), date, category });
        } else {
            onAdd({ description, amount: parseFloat(amount), date, category });
        }

        if (!editingExpense) {
            resetForm();
        }
    };

    const handleCancel = () => {
        setEditingExpense(null);
        setErrors({});
    };

    return (
        <form className="add-expense-form" onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 && (
                <div className="error-notification">
                    Please fill in all required fields correctly.
                </div>
            )}
            <div className="form-group">
                <label>Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) setErrors({ ...errors, description: false });
                    }}
                    placeholder="e.g. Coffee"
                    className={errors.description ? 'error' : ''}
                />
            </div>
            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) setErrors({ ...errors, amount: false });
                    }}
                    placeholder="0.00"
                    step="0.01"
                    className={errors.amount ? 'error' : ''}
                />
            </div>
            <div className="form-group">
                <label>Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={errors.category ? 'error' : ''}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: false });
                    }}
                    className={errors.date ? 'error' : ''}
                />
            </div>
            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1 }}>
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                {editingExpense && (
                    <button type="button" onClick={handleCancel} style={{ flex: 1, backgroundColor: '#666', backgroundImage: 'none', boxShadow: 'none' }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default AddExpenseForm;
