import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

const Settings = ({
    visible,
    onClose,
    currency,
    onUpdateCurrency,
    onAddCategory,
    categories,
    onViewReports
}) => {
    const [newCategory, setNewCategory] = useState('');
    const currencies = ['₹', '$', '€', '£', '¥'];

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

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
                        <Text style={styles.title}>Settings</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Analyze</Text>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: '#333', marginBottom: 20, alignItems: 'center' }]}
                        onPress={onViewReports}
                    >
                        <Text style={styles.addButtonText}>View Spending Reports</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Currency</Text>
                    <View style={styles.currencyContainer}>
                        {currencies.map(curr => (
                            <TouchableOpacity
                                key={curr}
                                style={[styles.currencyButton, currency === curr && styles.activeCurrency]}
                                onPress={() => onUpdateCurrency(curr)}
                            >
                                <Text style={styles.currencyText}>{curr}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Manage Categories</Text>
                    <View style={styles.addCategoryContainer}>
                        <TextInput
                            style={styles.input}
                            value={newCategory}
                            onChangeText={setNewCategory}
                            placeholder="New Category Name"
                            placeholderTextColor="#666"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.categoryList}>
                        <View style={styles.categoryChips}>
                            {categories.map(cat => (
                                <View key={cat} style={styles.categoryChip}>
                                    <Text style={styles.categoryChipText}>{cat}</Text>
                                </View>
                            ))}
                        </View>
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
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
    sectionTitle: {
        color: '#a0a0a0',
        fontSize: 14,
        textTransform: 'uppercase',
        marginBottom: 10,
        fontWeight: '600',
        marginTop: 10,
    },
    currencyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    currencyButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    activeCurrency: {
        backgroundColor: '#646cff',
        borderColor: '#646cff',
    },
    currencyText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addCategoryContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    addButton: {
        backgroundColor: '#28a745',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    categoryList: {
        maxHeight: 200,
    },
    categoryChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    categoryChipText: {
        color: '#ccc',
        fontSize: 14,
    },
});

export default Settings;
