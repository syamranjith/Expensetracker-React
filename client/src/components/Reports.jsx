import React, { useState, useMemo } from 'react';

const Reports = ({ expenses, currency, onClose }) => {
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
        <div className="modal-overlay">
            <div className="modal-content reports-modal" style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <h2>Spending Reports</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="reports-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {['daily', 'weekly', 'monthly', 'yearly'].map(v => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={view === v ? 'active' : ''}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="reports-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {aggregatedData.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>No data available.</p>
                    ) : (
                        aggregatedData.map(([key, amount]) => (
                            <div key={key} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span>{key}</span>
                                    <span>{currency}{amount.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    height: '10px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '5px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${(amount / maxAmount) * 100}%`,
                                        height: '100%',
                                        background: amount < 0 ? '#ff6b6b' : '#28a745'
                                    }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
