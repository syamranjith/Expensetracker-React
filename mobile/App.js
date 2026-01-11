import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './components/AddExpenseForm';
import ExpenseList from './components/ExpenseList';
import Settings from './components/Settings';
import Reports from './components/Reports';

// For iOS Simulator, localhost works. For Android Emulator, use 10.0.2.2.
// For physical device, use your machine's IP address.
const API_URL = 'http://192.168.31.113:5001/api/expenses';
const CATEGORIES_API_URL = 'http://192.168.31.113:5001/api/categories';
const SETTINGS_API_URL = 'http://192.168.31.113:5001/api/settings';

import { Modal } from 'react-native';

export default function App() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);
    const [currency, setCurrency] = useState('₹');
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isReportsVisible, setIsReportsVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error adding expense:', error);
            Alert.alert('Error', 'Could not add expense.');
        }
    };

    const handleUpdateExpense = async (updatedExpense) => {
        try {
            const response = await axios.put(`${API_URL}/${updatedExpense.id}`, updatedExpense);
            setExpenses(expenses.map(e => e.id === updatedExpense.id ? response.data : e));
            setEditingExpense(null);
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error updating expense:', error);
            Alert.alert('Error', 'Could not update expense.');
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
            Alert.alert('Error', 'Could not delete expense.');
        }
    };

    const handleAddCategory = async (newCategory) => {
        try {
            const response = await axios.post(CATEGORIES_API_URL, { category: newCategory });
            setCategories(response.data);
            Alert.alert("Success", "Category added successfully");
            return true;
        } catch (error) {
            console.error('Error adding category:', error);
            Alert.alert('Error', 'Could not add category. It might already exist.');
            return false;
        }
    };

    const handleUpdateCurrency = async (newCurrency) => {
        try {
            await axios.post(SETTINGS_API_URL, { currency: newCurrency });
            setCurrency(newCurrency);
        } catch (error) {
            console.error('Error updating currency:', error);
            Alert.alert('Error', 'Could not update currency.');
        }
    };

    const handleViewReports = () => {
        setIsSettingsVisible(false);
        setIsReportsVisible(true);
    };

    const openAddModal = () => {
        setEditingExpense(null);
        setIsAddModalVisible(true);
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setIsAddModalVisible(true);
    };

    const closeAddModal = () => {
        setEditingExpense(null);
        setIsAddModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Expense Tracker</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={openAddModal} style={styles.iconButton}>
                        <Text style={styles.iconButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.iconButton}>
                        <Text style={styles.iconButtonText}>⚙️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ExpenseList
                    expenses={expenses}
                    onDelete={handleDeleteExpense}
                    onEdit={openEditModal}
                    currency={currency}
                />
            </ScrollView>

            <Modal
                visible={isAddModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeAddModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AddExpenseForm
                            onAdd={handleAddExpense}
                            onUpdate={handleUpdateExpense}
                            editingExpense={editingExpense}
                            setEditingExpense={setEditingExpense}
                            categories={categories}
                            onAddCategory={handleAddCategory}
                            onCancel={closeAddModal}
                        />
                    </View>
                </View>
            </Modal>

            <Settings
                visible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
                currency={currency}
                onUpdateCurrency={handleUpdateCurrency}
                onAddCategory={handleAddCategory}
                categories={categories}
                onViewReports={handleViewReports}
            />

            <Reports
                visible={isReportsVisible}
                onClose={() => setIsReportsVisible(false)}
                expenses={expenses}
                currency={currency}
            />

            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 15,
    },
    iconButton: {
        padding: 5,
    },
    iconButtonText: {
        fontSize: 28,
        color: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
    }
});
