const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/expenses
app.get('/api/expenses', (req, res) => {
    const expenses = readData();
    res.json(expenses);
});

// POST /api/expenses
app.post('/api/expenses', (req, res) => {
    const { description, amount, date } = req.body;
    if (!description || !amount || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const expenses = readData();
    const newExpense = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        date
    };

    expenses.push(newExpense);
    writeData(expenses);
    res.status(201).json(newExpense);
});

// DELETE /api/expenses/:id
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    let expenses = readData();
    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== id);

    if (expenses.length === initialLength) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    writeData(expenses);
    res.json({ message: 'Expense deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
