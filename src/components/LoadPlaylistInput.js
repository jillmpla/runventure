//src/components/LoadPlaylistInput.js
//allows users to input a Spotify playlist URL and extract the playlist ID to load it

import React, { useState } from 'react';
import './SpotifyPlayer.css';

function LoadPlaylistInput({ onLoad }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    //extract playlist ID from the full Spotify playlist URL
    const match = input.match(/playlist\/([a-zA-Z0-9]+)/);
    const playlistId = match?.[1];

    if (playlistId) {
      onLoad(playlistId); //pass the ID back to the parent component
      setInput('');       //clear the input field
    } else {
      alert('Please enter a valid Spotify playlist URL');
    }
  };

  return (
    <form className="load-playlist-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Spotify Playlist URL"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="load-playlist-input"
      />
      <button type="submit" className="spotify-login-btn">
        Load Playlist
      </button>
    </form>
  );
}

export default LoadPlaylistInput;
