//src/components/SpotifyPlayer.js
//renders an embedded Spotify playlist player using the provided playlist ID

import React from 'react';
import './SpotifyPlayer.css';

function SpotifyPlayer({ playlistId }) {
  return (
    <div className="spotify-player">
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Playlist Player"
      ></iframe>
    </div>
  );
}

export default SpotifyPlayer;


