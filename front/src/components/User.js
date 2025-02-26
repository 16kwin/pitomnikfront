// src/components/User.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');

      if (!token) {
        setError('No token found. Please login.');
        navigate('/login'); // Redirect to login if no token
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
        localStorage.removeItem('jwtToken'); //remove invalid token
        navigate('/login'); //redirect to login

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

  return (
    <div>
      <h2>User Information</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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