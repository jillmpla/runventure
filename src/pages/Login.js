//src/pages/Login.js
//handles user login by validating credentials stored in localStorage and navigating to the dashboard upon success

import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './auth.css';

function Login() {
  const navigate = useNavigate();

  //state to track email and password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //handles login form submission
  const handleLogin = (e) => {
    e.preventDefault();

    //retrieve existing users from localStorage or use empty object if none exist
    const users = JSON.parse(localStorage.getItem('users')) || {};

    //validate credentials
    if (!users[email] || users[email] !== password) {
      alert('Invalid credentials');
      return;
    }

    //store logged-in user's email and navigate to dashboard
    localStorage.setItem('loggedInUser', email);
    navigate('/dashboard');
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="auth-page">
        <h1 className="home-title1">Welcome to RunVenture!</h1>
        <div className="auth-container">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="auth-button">LOGIN</button>
          </form>

          {/* Forgot Password Link */}
          <p className="auth-footer">
            <span className="auth-link" onClick={() => navigate('/reset-password')}>
              Forgot password?
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
