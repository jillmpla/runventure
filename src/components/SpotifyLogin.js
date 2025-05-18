//src/components/SpotifyLogin.js
//handles Spotify authentication, displaying a login button or logout option based on access token status

import React from 'react';
import { getSpotifyAuthURL } from '../utils/spotifyAuth';
import './SpotifyPlayer.css';

function SpotifyLogin() {
  const token = localStorage.getItem('spotifyAccessToken');

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    window.location.reload();
  };

  if (token) {
    return (
      <div className="spotify-status">
        Connected to Spotify
        <button className="spotify-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      className="spotify-login-btn"
      onClick={() => {
        const authURL = getSpotifyAuthURL();
        console.log('Redirecting to Spotify:', authURL);
        window.location.href = authURL;
      }}
    >
      Connect Spotify
    </button>
  );
}

export default SpotifyLogin;


  

