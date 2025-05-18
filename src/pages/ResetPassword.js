//src/pages/ResetPassword.js
//allows users to reset their password by updating it in localStorage if the email exists

import React from 'react';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './auth.css';

function ResetPassword() {
  //state to track form inputs and response message
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  //handles password reset form submission
  const handleReset = (e) => {
    e.preventDefault();

    //check if the user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[email]) {
      setMessage("User not found");
      return;
    }

    //update user's password in localStorage
    users[email] = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    //display success message
    setMessage("Password reset successfully!");
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="auth-page">
        <h1 className="home-title1">Welcome to RunVenture!</h1>

        <div className="auth-container">
          {/* Reset Password Form */}
          <form onSubmit={handleReset} className="auth-form">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button type="submit" className="auth-button">Reset Password</button>
          </form>

          {/* Feedback Message */}
          {message && <p className="auth-footer">{message}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ResetPassword;
