//src/components/Header.js
//displays the logged-out user header

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleDropdown = (section) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <header className="headerloggedout">
      <div className="logo" onClick={() => navigate('/')}>
        <span className="logo-text">
          RunVenture
          <img src="/shoeicon.png" alt="shoe" className="shoe-icon" />
        </span>
      </div>

      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={`nav-center ${mobileMenuOpen ? 'show' : ''}`} ref={navRef}>
        <ul className="nav-list">
          <li className={`dropdown ${activeDropdown === 'workouts' ? 'active' : ''}`} onClick={() => toggleDropdown('workouts')}>
            <span className="nav-item">Workouts</span>
            {activeDropdown === 'workouts' && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate('/signup')}>Dashboard</li>
                <li onClick={() => navigate('/signup')}>Run</li>
                <li onClick={() => navigate('/signup')}>Training</li>
                <li onClick={() => navigate('/signup')}>Post-Run</li>
              </ul>
            )}
          </li>

          <li className={`dropdown ${activeDropdown === 'routes' ? 'active' : ''}`} onClick={() => toggleDropdown('routes')}>
            <span className="nav-item">Routes</span>
            {activeDropdown === 'routes' && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate('/signup')}>Route Conditions</li>
              </ul>
            )}
          </li>

          <li className={`dropdown ${activeDropdown === 'community' ? 'active' : ''}`} onClick={() => toggleDropdown('community')}>
            <span className="nav-item">Community</span>
            {activeDropdown === 'community' && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate('/signup')}>Social Challenges</li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <span className="nav-link" onClick={() => navigate('/login')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/login')}>
          Login
        </span>
        <span className="nav-link" onClick={() => navigate('/signup')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/signup')}>
          Signup
        </span>
      </div>
    </header>
  );
}

export default Header;


