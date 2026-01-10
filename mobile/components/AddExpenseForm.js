import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AddExpenseForm = ({ onAdd, onUpdate, editingExpense, setEditingExpense, categories = [], onAddCategory }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Other');
    const [errors, setErrors] = useState({});

    // New Category State
    const [newCategory, setNewCategory] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);

    useEffect(() => {
        if (editingExpense) {
            setDescription(editingExpense.description);
            setAmount(editingExpense.amount.toString());
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const expenseData = {
            description,
            amount: parseFloat(amount),
            date,
            category
        };

        if (editingExpense) {
            onUpdate({ ...editingExpense, ...expenseData });
        } else {
            onAdd(expenseData);
            resetForm();
        }
    };

    const handleCancel = () => {
        setEditingExpense(null);
        setErrors({});
    };

    const handleAddNewCategory = async () => {
        if (newCategory.trim()) {
            const success = await onAddCategory(newCategory.trim());
            if (success) {
                setCategory(newCategory.trim());
                setNewCategory('');
                setShowAddCategory(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            {Object.keys(errors).length > 0 && (
                <Text style={styles.errorBanner}>Please fill in all fields</Text>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, errors.description && styles.inputError]}
                value={description}
                onChangeText={(text) => {
                    setDescription(text);
                    if (errors.description) setErrors({ ...errors, description: false });
                }}
                placeholder="e.g. Coffee"
                placeholderTextColor="#666"
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                value={amount}
                onChangeText={(text) => {
                    setAmount(text);
                    if (errors.amount) setErrors({ ...errors, amount: false });
                }}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
                style={[styles.input, errors.date && styles.inputError]}
                value={date}
                onChangeText={(text) => {
                    setDate(text);
                    if (errors.date) setErrors({ ...errors, date: false });
                }}
                placeholder="2026-01-01"
                placeholderTextColor="#666"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={[styles.label, { marginBottom: 0 }]}>Category</Text>
                <TouchableOpacity onPress={() => setShowAddCategory(!showAddCategory)}>
                    <Text style={{ color: '#646cff', fontSize: 12, fontWeight: 'bold' }}>{showAddCategory ? 'Cancel' : '+ Add New'}</Text>
                </TouchableOpacity>
            </View>

            {showAddCategory && (
                <View style={{ marginBottom: 10, flexDirection: 'row', gap: 8 }}>
                    <TextInput
                        style={[styles.input, { marginBottom: 0, flex: 1 }]}
                        value={newCategory}
                        onChangeText={setNewCategory}
                        placeholder="New Category"
                        placeholderTextColor="#666"
                    />
                    <TouchableOpacity style={styles.addCatButton} onPress={handleAddNewCategory}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {categories.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                        {editingExpense ? 'Update Expense' : 'Add Expense'}
                    </Text>
                </TouchableOpacity>

                {editingExpense && (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    errorBanner: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    label: {
        color: '#a0a0a0',
        fontSize: 12,
        marginBottom: 6,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    inputError: {
        borderColor: '#ff6b6b',
        borderWidth: 1,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        maxHeight: 50,
    },
    categoryChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 8,
    },
    categoryChipSelected: {
        backgroundColor: '#646cff',
    },
    categoryText: {
        color: '#ccc',
        fontSize: 12,
    },
    categoryTextSelected: {
        color: 'white',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#646cff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#666',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addCatButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 14,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddExpenseForm;
