import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExpenseList = ({ expenses, onDelete, onEdit, currency }) => {
    if (expenses.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No transactions yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Transaction History</Text>
            {expenses.map((expense) => (
                <View key={expense.id} style={styles.card}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.date}>{expense.date}</Text>
                        <Text style={styles.description}>{expense.description}</Text>
                        <Text style={styles.category}>{expense.category}</Text>
                        <Text style={expense.amount < 0 ? styles.amountExpense : styles.amountIncome}>
                            {currency}{parseFloat(expense.amount).toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => onEdit(expense)}
                        >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete(expense.id)}
                        >
                            <Text style={styles.actionText}>Del</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
    },
    header: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    infoContainer: {
        flex: 1,
    },
    date: {
        color: '#888',
        fontSize: 12,
        marginBottom: 2,
    },
    description: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    category: {
        color: '#aaa',
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    amountIncome: {
        color: '#00d2d3',
        fontWeight: 'bold',
        fontSize: 16,
    },
    amountExpense: {
        color: '#ff6b6b',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actions: {
        flexDirection: 'column',
        gap: 8,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ExpenseList;
