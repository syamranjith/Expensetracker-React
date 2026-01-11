import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ExpenseList = ({ expenses, onDelete, onEdit, currency }) => {
    const [filterType, setFilterType] = useState('all'); // all, daily, weekly, monthly, yearly

    const filteredExpenses = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const expenseDay = new Date(expenseDate.getFullYear(), expenseDate.getMonth(), expenseDate.getDate());

            if (filterType === 'daily') {
                return expenseDay.getTime() === today.getTime();
            } else if (filterType === 'weekly') {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
                const lastDayOfWeek = new Date(today);
                lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));
                return expenseDay >= firstDayOfWeek && expenseDay <= lastDayOfWeek;
            } else if (filterType === 'monthly') {
                return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
            } else if (filterType === 'yearly') {
                return expenseDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [expenses, filterType]);

    const { totalIncome, totalExpense } = useMemo(() => {
        return filteredExpenses.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount);
            if (amount > 0) {
                acc.totalIncome += amount;
            } else {
                acc.totalExpense += amount;
            }
            return acc;
        }, { totalIncome: 0, totalExpense: 0 });
    }, [filteredExpenses]);

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'daily', 'weekly', 'monthly', 'yearly'].map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterBtn, filterType === type && styles.activeFilterBtn]}
                            onPress={() => setFilterType(type)}
                        >
                            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={styles.incomeText}>{currency}{totalIncome.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryCard, { marginHorizontal: 10 }]}>
                    <Text style={styles.summaryLabel}>Expense</Text>
                    <Text style={styles.expenseText}>{currency}{Math.abs(totalExpense).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Balance</Text>
                    <Text style={styles.balanceText}>{currency}{(totalIncome + totalExpense).toFixed(2)}</Text>
                </View>
            </View>

            <Text style={styles.header}>Transaction History</Text>

            {filteredExpenses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions for this period.</Text>
                </View>
            ) : (
                filteredExpenses.map((expense) => (
                    <View key={expense.id} style={styles.card}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.date}>{expense.date}</Text>
                            <Text style={styles.description}>{expense.description}</Text>
                            <Text style={styles.category}>{expense.category || 'Other'}</Text>
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
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 40,
    },
    filtersContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeFilterBtn: {
        backgroundColor: '#646cff',
        borderColor: '#646cff',
    },
    filterText: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilterText: {
        color: 'white',
        fontWeight: 'bold',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    summaryLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    incomeText: {
        color: '#00d2d3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    expenseText: {
        color: '#ff6b6b',
        fontSize: 16,
        fontWeight: 'bold',
    },
    balanceText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
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
