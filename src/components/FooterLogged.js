//src/components/FooterLogged.js
//displays the logged-in user footer

import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

function FooterLogged() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footerfinalall">
      <p>
        © {currentYear}{' '}
        <span className="footer-link" onClick={() => navigate('/dashboard')}>
          RunVenture
        </span>. All rights reserved.
      </p>
    </footer>
  );
}

export default FooterLogged;