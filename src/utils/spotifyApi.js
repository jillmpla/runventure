//src/utils/spotifyApi.js
//fetches the current user's Spotify playlists using their access token

export async function fetchUserPlaylists(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
  
    const data = await response.json();
    return data.items;
  }
  