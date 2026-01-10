import React, { useState, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Reports = ({ visible, onClose, expenses, currency }) => {
    const [view, setView] = useState('daily'); // daily, weekly, monthly, yearly

    const aggregatedData = useMemo(() => {
        const data = {};

        expenses.forEach(expense => {
            const date = new Date(expense.date);
            let key;

            if (view === 'daily') {
                key = expense.date;
            } else if (view === 'weekly') {
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
                const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                key = `${date.getFullYear()}-W${weekNum}`;
            } else if (view === 'monthly') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            } else if (view === 'yearly') {
                key = `${date.getFullYear()}`;
            }

            if (!data[key]) data[key] = 0;
            data[key] += parseFloat(expense.amount);
        });

        return Object.entries(data).sort((a, b) => b[0].localeCompare(a[0]));
    }, [expenses, view]);

    const maxAmount = Math.max(...aggregatedData.map(([, amount]) => amount), 0);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Spending Reports</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabsContainer}>
                        {['daily', 'weekly', 'monthly', 'yearly'].map(v => (
                            <TouchableOpacity
                                key={v}
                                style={[styles.tab, view === v && styles.activeTab]}
                                onPress={() => setView(v)}
                            >
                                <Text style={[styles.tabText, view === v && styles.activeTabText]}>
                                    {v}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ScrollView style={styles.reportsList}>
                        {aggregatedData.length === 0 ? (
                            <Text style={styles.emptyText}>No data available.</Text>
                        ) : (
                            aggregatedData.map(([key, amount]) => (
                                <View key={key} style={styles.reportItem}>
                                    <View style={styles.reportHeader}>
                                        <Text style={styles.reportKey}>{key}</Text>
                                        <Text style={styles.reportAmount}>{currency}{amount.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.barContainer}>
                                        <View style={[
                                            styles.bar,
                                            {
                                                width: `${(amount / maxAmount) * 100}%`,
                                                backgroundColor: amount < 0 ? '#ff6b6b' : '#28a745'
                                            }
                                        ]} />
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20,
        maxHeight: '90%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    closeButton: {
        fontSize: 24,
        color: 'white',
        padding: 5,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#646cff',
    },
    tabText: {
        color: '#ccc',
        textTransform: 'capitalize',
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    reportsList: {
        flex: 1,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    reportItem: {
        marginBottom: 20,
    },
    reportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reportKey: {
        color: '#fff',
        fontWeight: '500',
    },
    reportAmount: {
        color: '#fff',
        fontWeight: 'bold',
    },
    barContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
    },
});

export default Reports;
