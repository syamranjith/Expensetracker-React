import React from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Home = ({
    expenses,
    onAdd,
    onUpdate,
    onDelete,
    editingExpense,
    setEditingExpense,
    categories,
    currency
}) => {
    return (
        <div className="home-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <AddExpenseForm
                onAdd={onAdd}
                onUpdate={onUpdate}
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
                categories={categories}
            />
            <ExpenseList
                expenses={expenses}
                onDelete={onDelete}
                onEdit={setEditingExpense}
                currency={currency}
            />
        </div>
    );
};

export default Home;
