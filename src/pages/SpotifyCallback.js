//src/pages/SpotifyCallback.js
//handles the redirect after Spotify login

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    //get the hash portion of the URL after redirect from Spotify
    const hash = window.location.hash;

    //parse the URL hash to extract parameters
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    //if an access token is present, store it in localStorage
    if (accessToken) {
      localStorage.setItem('spotifyAccessToken', accessToken);
    }

    //redirect user back to the Run page
    navigate('/run');
  }, [navigate]);

  //render a simple loading message while processing
  return <p>Connecting to Spotify...</p>;
}

export default SpotifyCallback;

