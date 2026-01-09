import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete }) => {
    return (
        <div className="expense-list">
            <h2>Transaction History</h2>
            {expenses.length === 0 ? (
                <p>No transactions yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{expense.date}</td>
                                <td>{expense.description}</td>
                                <td className={expense.amount < 0 ? 'expense' : 'income'}>
                                    ${Math.abs(expense.amount).toFixed(2)}
                                </td>
                                <td>
                                    <button className="delete-btn" onClick={() => onDelete(expense.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExpenseList;
