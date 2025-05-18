//src/components/PlaylistSelector.js
//fetches and displays the user's Spotify playlists in a dropdown for selection

import React, { useEffect, useState } from 'react';
import { fetchUserPlaylists } from '../utils/spotifyApi';
import './PlaylistSelector.css';

function PlaylistSelector({ onSelect }) {
  const [playlists, setPlaylists] = useState([]);
  const token = localStorage.getItem('spotifyAccessToken');

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const userPlaylists = await fetchUserPlaylists(token);
        setPlaylists(userPlaylists);
      } catch (err) {
        console.error('Error loading playlists', err);
      }
    };

    if (token) getPlaylists();
  }, [token]);

  const handleChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div className="playlist-selector">
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>
          Select a playlist
        </option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PlaylistSelector;


