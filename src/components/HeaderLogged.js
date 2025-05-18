//src/components/HeaderLogged.js
//displays the logged-in user header with navigation, dropdowns, and logout modal (mobile + desktop ready)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderLogged.css';

function HeaderLogged() {
  const navigate = useNavigate();

  //tracks which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState(null);
  //toggles the hamburger mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //controls visibility of the logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navRef = useRef(null);

  //toggle dropdown menu state for a section
  const toggleDropdown = (section, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  //handles ESC key to close dropdowns and modals
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setActiveDropdown(null);
      setMobileMenuOpen(false);
      setShowLogoutModal(false);
    }
  };

  //click outside or resize listener to close nav menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', () => setMobileMenuOpen(false));

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', () => setMobileMenuOpen(false));
    };
  }, []);

  //redirect to login if user is not logged in
  useEffect(() => {
    if (!localStorage.getItem('loggedInUser')) {
      navigate('/login');
    }
  }, [navigate]);

  //confirm logout and clear user from localStorage
  const confirmLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  return (
    <header className="headerloggy">
      {/* Logo that navigates to dashboard */}
      <div className="logo" onClick={() => navigate('/dashboard')}>
        <span className="logo-text">
          RunVenture
          <img src="/shoeicon.png" alt="shoe" className="shoe-icon" />
        </span>
      </div>

      {/* Hamburger menu for mobile */}
      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Navigation Menu */}
      <nav className={`nav-center ${mobileMenuOpen ? 'show' : ''}`} ref={navRef}>
        <ul className="nav-list">
          {/* Workouts Dropdown */}
          <li className={`dropdown ${activeDropdown === 'workouts' ? 'active' : ''}`}>
            <button
              className="nav-item"
              onClick={(e) => toggleDropdown('workouts', e)}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'workouts'}
            >
              Workouts
            </button>
            {activeDropdown === 'workouts' && (
              <ul className="dropdown-menu" role="menu">
                <li onMouseDown={() => navigate('/dashboard')} onTouchStart={() => navigate('/dashboard')}>Dashboard</li>
                <li onMouseDown={() => navigate('/run')} onTouchStart={() => navigate('/run')}>Run</li>
                <li onMouseDown={() => navigate('/training')} onTouchStart={() => navigate('/training')}>Training</li>
                <li onMouseDown={() => navigate('/postrun')} onTouchStart={() => navigate('/postrun')}>Post Run</li>
              </ul>
            )}
          </li>

          {/* Routes Dropdown */}
          <li className={`dropdown ${activeDropdown === 'routes' ? 'active' : ''}`}>
            <button
              className="nav-item"
              onClick={(e) => toggleDropdown('routes', e)}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'routes'}
            >
              Routes
            </button>
            {activeDropdown === 'routes' && (
              <ul className="dropdown-menu" role="menu">
                <li onMouseDown={() => navigate('/routeconditions')} onTouchStart={() => navigate('/routeconditions')}>
                  Route Conditions
                </li>
              </ul>
            )}
          </li>

          {/* Community Dropdown */}
          <li className={`dropdown ${activeDropdown === 'community' ? 'active' : ''}`}>
            <button
              className="nav-item"
              onClick={(e) => toggleDropdown('community', e)}
              aria-haspopup="true"
              aria-expanded={activeDropdown === 'community'}
            >
              Community
            </button>
            {activeDropdown === 'community' && (
              <ul className="dropdown-menu" role="menu">
                <li onMouseDown={() => navigate('/socialchallenges')} onTouchStart={() => navigate('/socialchallenges')}>
                  Social Challenges
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* User Icon Dropdown */}
      <div className="auth-buttons">
        <div className={`dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
          <button
            className="user-button"
            onClick={(e) => toggleDropdown('user', e)}
            aria-haspopup="true"
            aria-expanded={activeDropdown === 'user'}
          >
            {/* User SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="28"
              height="28"
              className="user-icon-svg"
            >
              <path
                fillRule="evenodd"
                d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 16a7 7 0 0114 0v2H5v-2z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Logout Option */}
          {activeDropdown === 'user' && (
            <ul className="dropdown-menu" role="menu">
              <li
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowLogoutModal(true);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setShowLogoutModal(true);
                }}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Logout Modal Confirmation */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="logout-yes-btn">Yes</button>
              <button onClick={() => setShowLogoutModal(false)} className="logout-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default HeaderLogged;

