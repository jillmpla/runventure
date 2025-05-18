//src/components/Footer.js
//displays the logged-out user footer

import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footerfinalall">
      <p>
        © {currentYear}{' '}
        <span className="footer-link" onClick={() => navigate('/')}>
          RunVenture
        </span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
