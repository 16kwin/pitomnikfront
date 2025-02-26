// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import User from './components/User';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken')); // Check if token exists on app load

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div>
                <h1>My App</h1>
                {isLoggedIn ? (
                    // User is logged in, show User component
                    <Routes>
                        <Route path="/user" element={<User onLogout={handleLogout} />} />
                        <Route path="/" element={<Navigate to="/user" />} /> {/* Redirect root to /user if logged in */}
                    </Routes>
                ) : (
                    // User is not logged in, show Login and Register options
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <div>
                                <Link to="/login">Login</Link> {/* Link to Login page */}
                                <Link to="/register">Register</Link> {/* Link to Register page */}
                            </div>
                        } />
                    </Routes>
                )}
            </div>
        </Router>
    );
}

export default App;