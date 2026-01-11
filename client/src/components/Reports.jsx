import React, { useState, useMemo } from 'react';

const Reports = ({ expenses, currency }) => {
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

            if (!data[key]) data[key] = { income: 0, expense: 0 };
            const amount = parseFloat(expense.amount);
            if (amount > 0) {
                data[key].income += amount;
            } else {
                data[key].expense += Math.abs(amount);
            }
        });

        return Object.entries(data).sort((a, b) => b[0].localeCompare(a[0]));
    }, [expenses, view]);

    const maxAmount = Math.max(...aggregatedData.map(([, { income, expense }]) => Math.max(income, expense)), 0) || 1;

    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Spending Reports</h2>

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

            <div className="reports-list">
                {aggregatedData.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>No data available.</p>
                ) : (
                    aggregatedData.map(([key, { income, expense }]) => (
                        <div key={key} style={{ marginBottom: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                            <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#ccc', fontSize: '0.9rem' }}>{key}</div>

                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <div style={{ width: '60px', fontSize: '0.8rem', color: '#00d2d3', fontWeight: '600' }}>Income</div>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginRight: '10px' }}>
                                    <div style={{ width: `${(income / maxAmount) * 100}%`, height: '100%', background: '#00d2d3', transition: 'width 0.5s ease' }}></div>
                                </div>
                                <div style={{ width: '70px', textAlign: 'right', fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>{currency}{income.toFixed(0)}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '60px', fontSize: '0.8rem', color: '#ff6b6b', fontWeight: '600' }}>Expense</div>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginRight: '10px' }}>
                                    <div style={{ width: `${(expense / maxAmount) * 100}%`, height: '100%', background: '#ff6b6b', transition: 'width 0.5s ease' }}></div>
                                </div>
                                <div style={{ width: '70px', textAlign: 'right', fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>{currency}{expense.toFixed(0)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reports;
