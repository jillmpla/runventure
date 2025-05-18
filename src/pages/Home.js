//src/pages/Home.js
//main landing page for RunVenture, providing a welcome message, signup/login options, and a preview of app features

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      {/* Top navigation/header */}
      <Header />

      <main className="home">
        {/* Title */}
        <h1 className="home-title">Welcome to RunVenture!</h1>

        {/* Hero image section */}
        <div className="hero-container">
          <img src="/workouthome.png" alt="Workout" className="hero-image" />
        </div>

        {/* Signup button */}
        <button className="signup-button" onClick={() => navigate('/signup')}>
          SIGNUP
        </button>

        {/* Link to login page for existing users */}
        <p className="member-text">
          Already a member?{' '}
          <span className="login-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>

        {/* Feature highlight section */}
        <div className="features-container">
          <div className="features">
            {/* Feature 1 */}
            <div className="feature-box">
              <h3 className="feature-title">Stay in the Zone</h3>
              <p>Stay focused with easy music control and seamless playlist support.</p>
            </div>

            {/* Visual divider */}
            <img src="/shoeicon.png" alt="divider" className="feature-divider" />

            {/* Feature 2 */}
            <div className="feature-box">
              <h3 className="feature-title">Custom Workouts</h3>
              <p>Follow personalized workout plans designed for your running goals.</p>
            </div>

            {/* Visual divider */}
            <img src="/shoeicon.png" alt="divider" className="feature-divider" />

            {/* Feature 3 */}
            <div className="feature-box">
              <h3 className="feature-title">Before You Hit Go</h3>
              <p>Preview routes with real-time difficulty, terrain, and traffic details.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom footer */}
      <Footer />
    </div>
  );
}

export default Home;



