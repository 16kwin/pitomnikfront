// src/components/User.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = ({onLogout}) => { //Receive onLogout Function
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwtToken'); // Получаем JWT из localStorage

            if (!token) {
                setError('No token found. Please login.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/user', { // Замени на URL своего backend-а
                    headers: {
                        Authorization: `Bearer ${token}`, // Добавляем заголовок Authorization с JWT
                    },
                });

                setUserData(response.data); // Сохраняем данные пользователя в состояние
                setError(''); // Очищаем сообщение об ошибке
            } catch (error) {
                console.error('Error fetching user data:', error);

                if (error.response && error.response.status === 403) {
                    setError('Unauthorized. You do not have permission to view this resource.');
                }
                else if (error.response && error.response.status === 401) {
                    setError('Unauthorized. Please login.');
                }
                else {
                    setError('Failed to fetch user data. Please try again.');
                }
                setUserData(null); // Clear user data on error
            }
        };

        fetchUserData();
    }, []); // [] - useEffect вызывается только один раз при монтировании компонента

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        onLogout()
    }

    return (
        <div>
            <h2>User Information</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображаем сообщение об ошибке */}
            {userData && (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>First Name: {userData.firstname}</p>
                    <p>Last Name: {userData.lastname}</p>
                    {userData.role && <p>Role: {userData.role.name}</p>}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default User;