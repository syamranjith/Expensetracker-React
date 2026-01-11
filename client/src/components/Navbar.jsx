import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1>ExpenseTracker</h1>
            </div>
            <div className="navbar-links">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    Home
                </Link>
                <Link to="/reports" className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}>
                    Reports
                </Link>
                <Link to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
                    Transactions
                </Link>
                <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
                    Settings
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
