// src/components/User.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/User.css'; // Import CSS file

const User = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dogs'); // Changed default to 'dogs'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setError('No token found. Please login.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('jwtToken');
                navigate('/login');

                if (error.response && error.response.status === 403) {
                    setError('Unauthorized. You do not have permission to view this resource.');
                } else if (error.response && error.response.status === 401) {
                    setError('Unauthorized. Please login.');
                } else {
                    setError('Failed to fetch user data. Please try again.');
                }
                setUserData(null);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/login');
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="user-container">
            {/* Шапка */}
            <header className="user-header">
                <div className="user-info">
                    {userData && `${userData.firstname} ${userData.lastname}`}
                </div>
                <button onClick={handleLogout}>Logout</button>
            </header>

            {/* Основная часть */}
            <div className="user-main-content">
                {/* Меню слева */}
                <aside className="user-menu">
                    <ul>
                        <li onClick={() => handleTabClick('cats')}>Cats</li>
                        <li onClick={() => handleTabClick('dogs')}>Dogs</li>
                        <li onClick={() => handleTabClick('documents')}>Documents</li>
                        <li onClick={() => handleTabClick('info')}>Info</li>
                    </ul>
                </aside>

                {/* Контент справа */}
                <main className="user-content">
                    {error && <p className="error">{error}</p>}
                    {activeTab === 'cats' && <div>Content for Cats</div>}
                    {activeTab === 'dogs' && (
                        <div>
                            {/* Admin Buttons */}
                            {userData && userData.role && userData.role.name === 'ADMIN' && (
                                <div className="admin-buttons">
                                    <button>ADMIN BUTTONS</button>
                                </div>
                            )}

                            {/* Operator and Admin Buttons */}
                            {userData && userData.role && (userData.role.name === 'OPER' || userData.role.name === 'ADMIN') && (
                                <div className="oper-buttons">
                                    <button>OPER BUTTONS</button>
                                </div>
                            )}

                            {/* Guest, Admin and Oper Buttons */}
                            {userData && userData.role && (userData.role.name === 'QUEST' || userData.role.name === 'ADMIN' || userData.role.name === 'OPER') && (
                                <div className="quest-buttons">
                                    <button>QUEST BUTTONS</button>
                                </div>
                            )}
                            Content for Dogs
                        </div>
                    )}
                    {activeTab === 'documents' && <div>Content for Documents</div>}
                    {activeTab === 'info' && <div>content for info</div>}
                </main>
            </div>
        </div>
    );
};

export default User;