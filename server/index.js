const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'data.json');
const CATEGORIES_FILE = path.join(__dirname, 'categories.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

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

// Helper to read categories
const readCategories = () => {
    if (!fs.existsSync(CATEGORIES_FILE)) {
        return ["Food", "Travel", "Utilities", "Entertainment", "Other"];
    }
    const data = fs.readFileSync(CATEGORIES_FILE);
    return JSON.parse(data);
};

// Helper to read settings
const readSettings = () => {
    if (!fs.existsSync(SETTINGS_FILE)) {
        return { currency: "₹" };
    }
    const data = fs.readFileSync(SETTINGS_FILE);
    return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Helper to write categories
const writeCategories = (data) => {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2));
};

// Helper to write settings
const writeSettings = (data) => {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
};

// GET /api/settings
app.get('/api/settings', (req, res) => {
    const settings = readSettings();
    res.json(settings);
});

// POST /api/settings
app.post('/api/settings', (req, res) => {
    const newSettings = req.body;
    const currentSettings = readSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    writeSettings(updatedSettings);
    res.json(updatedSettings);
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
    const categories = readCategories();
    res.json(categories);
});

// POST /api/categories
app.post('/api/categories', (req, res) => {
    const { category } = req.body;
    if (!category) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const categories = readCategories();
    if (categories.includes(category)) {
        return res.status(400).json({ error: 'Category already exists' });
    }

    categories.push(category);
    writeCategories(categories);
    res.status(201).json(categories);
});

// GET /api/expenses
app.get('/api/expenses', (req, res) => {
    const expenses = readData();
    res.json(expenses);
});

// POST /api/expenses
app.post('/api/expenses', (req, res) => {
    const { description, amount, date, category } = req.body;
    if (!description || !amount || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const expenses = readData();
    const newExpense = {
        id: Date.now().toString(),
        description,
        amount: parseFloat(amount),
        date,
        category
    };

    expenses.push(newExpense);
    writeData(expenses);
    res.status(201).json(newExpense);
});

// PUT /api/expenses/:id
app.put('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { description, amount, date, category } = req.body;
    let expenses = readData();
    const index = expenses.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    if (!description || !amount || !date || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    expenses[index] = { ...expenses[index], description, amount: parseFloat(amount), date, category };
    writeData(expenses);
    res.json(expenses[index]);
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
