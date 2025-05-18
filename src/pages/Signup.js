//src/pages/Signup.js
//handles user signup by storing new account credentials in localStorage and redirecting to the dashboard

import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './auth.css';

function Signup() {
  const navigate = useNavigate();

  //state for managing user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //handles signup form submission
  const handleSignup = (e) => {
    e.preventDefault();

    //retrieve existing users or initialize empty object
    const users = JSON.parse(localStorage.getItem('users')) || {};

    //prevent signup if email already exists
    if (users[email]) {
      alert('User already exists');
      return;
    }

    //add new user to users object
    users[email] = password;

    //save updated users object and current login to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', email);

    //redirect to dashboard after signup
    navigate('/dashboard');
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="auth-page">
        <h1 className="home-title1">Welcome to RunVenture!</h1>

        <div className="auth-container">
          {/* Signup form */}
          <form onSubmit={handleSignup} className="auth-form">
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

            <button type="submit" className="auth-button">SIGN UP</button>
          </form>

          {/* Link to login page */}
          <p className="auth-footer">
            Already a member?{' '}
            <span onClick={() => navigate('/login')} className="auth-link">
              Login
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Signup;


