// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', {
        username: username,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem('jwtToken', token);
      setUsername('');
      setPassword('');
      setError('');
      navigate('/user'); // Redirect to /user after successful login
    } catch (error) {
      console.error('Login error:', error);

      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/register">Register</Link> {/* Link to Register page */}
    </div>
  );
};

export default Login;