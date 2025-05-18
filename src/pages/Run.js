//src/pages/Run.js
//tracks live user runs using the Geolocation API (W3C standard)
//displays road-snapped paths using the Google Maps Directions API (Google)
//and integrates music playback with the Spotify Web Playback SDK (Spotify)

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, MarkerF, Polyline, useJsApiLoader } from '@react-google-maps/api';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import './Run.css';
import SpotifyPlayer from '../components/SpotifyPlayer';
import SpotifyLogin from '../components/SpotifyLogin';
import PlaylistSelector from '../components/PlaylistSelector';
import LoadPlaylistInput from '../components/LoadPlaylistInput';

//google maps container dimensions
const containerStyle = {
  width: '100%',
  height: '400px',
};

//fallback location if geolocation fails
const fallbackLocation = {
  lat: 35.305,
  lng: -80.733,
};

//calculates distance between two coordinates using the Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function Run() {
  //run tracking state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState('-');
  const [avgPace, setAvgPace] = useState('-');
  const [path, setPath] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  //refs for timers and map instance
  const holdTimeout = useRef(null);
  const timerRef = useRef(null);
  const watchRef = useRef(null);
  const mapRef = useRef(null);
  const onLoad = (map) => { mapRef.current = map; };

  const navigate = useNavigate();

  //load planned route from localStorage if it exists (set via RouteConditions.js)
  //used to display start/end markers and snapped route on the map
  const plannedRoute = localStorage.getItem('plannedRoute') 
  ? JSON.parse(localStorage.getItem('plannedRoute')) 
  : null;

  //load Google Maps with geometry library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });

  //helpers to format time and pace
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const formatPace = (sPerMi) => `${Math.floor(sPerMi / 60)}:${String(Math.round(sPerMi % 60)).padStart(2, '0')}`;

  //start tracking run
  const startRun = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
      setCalories((c) => c + 1);
    }, 1000);

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentLocation(newLoc);
        setPath((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = getDistance(last.lat, last.lng, newLoc.lat, newLoc.lng);
            setDistance((d) => d + dist);
            setPace(formatPace(dist > 0 ? 60 / (dist * 60 / 1) : 0));
          }
          return [...prev, newLoc];
        });
      },
      () => {
        setCurrentLocation(fallbackLocation);
        setLocationError(true);
        alert('Location tracking failed. Using fallback location.');
      },
      { enableHighAccuracy: true }
    );
  };

  //pause tracking
  const pauseRun = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
  };

  //finish and save run
  const finishRun = () => {
    pauseRun();
    if (duration > 0 && distance > 0) {
      setAvgPace(formatPace(duration / distance / 60));
    }

    const runData = {
      date: new Date().toISOString(),
      duration,
      distance: distance.toFixed(2),
      calories,
      pace,
      avgPace,
    };

    const email = localStorage.getItem('loggedInUser');
    const allRuns = JSON.parse(localStorage.getItem(`runs-${email}`)) || [];
    allRuns.push(runData);
    localStorage.setItem(`runs-${email}`, JSON.stringify(allRuns));
    localStorage.removeItem('plannedRoute');
    navigate('/postrun');
  };

  //retry geolocation if previously denied
  const requestLocationAccess = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(false);
      },
      () => {
        alert('Still no permission. Please enable location in browser settings.');
      }
    );
  };

  //centers map on user's location
  const centerMap = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.panTo(currentLocation);
    }
  };

  //handles hold-to-finish gesture
  const handleHoldStart = () => {
    setIsHolding(true);
    holdTimeout.current = setTimeout(() => {
      finishRun();
      setIsHolding(false);
    }, 1500);
  };

  const handleHoldEnd = () => {
    clearTimeout(holdTimeout.current);
    setIsHolding(false);
  };

  //initial location fetch on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setCurrentLocation(fallbackLocation);
        setLocationError(true);
      }
    );

    return () => {
      clearInterval(timerRef.current);
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, []);

  //road-snapped path state
  const [directionsPath, setDirectionsPath] = useState(null);

  //uses DirectionsService to snap route to roads
  const getRouteViaClient = (start, end) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === 'OK' && result.routes.length > 0) {
          const path = result.routes[0].overview_path;
          setDirectionsPath(path);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  //on mount, check for a planned route (RouteConditions.js) and render it visually on the map
  //sets the start location for centering and fetches a road-snapped path for display only
  useEffect(() => {
    if (!isLoaded) return;
  
    const stored = localStorage.getItem('plannedRoute');
    if (stored) {
      const { start, end } = JSON.parse(stored);
      if (start && end) {
        setCurrentLocation(start);      //only set the start location
        getRouteViaClient(start, end);  //display path for visual purposes
      }
    }
  }, [isLoaded]);  

  const spotifyToken = localStorage.getItem('spotifyAccessToken');
  const [selectedPlaylist, setSelectedPlaylist] = useState('37i9dQZF1DXcBWIGoYBM5M'); //default playlist

  return (
    <div className="page-wrapper">
      <HeaderLogged />
      <main className="run-page">
        <h1 className="run-header">Run</h1>
        <p className="run-subheader">CURRENT ACTIVITY</p>

        <div className="run-activity-wrapper">
          {/* Start/Pause and Hold to Finish Buttons */}
          <div className="run-controls">
            <button
              className={`resume-button ${isRunning ? 'pause' : 'resume'}`}
              onClick={() => isRunning ? pauseRun() : startRun()}
            >
              {isRunning ? 'PAUSE' : 'RESUME'}
            </button>

            <span
              className={`hold-finish ${isHolding ? 'holding' : ''}`}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              <span>HOLD TO FINISH</span>
            </span>
          </div>

          {/* Location access error handling */}
          {locationError && (
            <div className="location-error">
              Location access denied.
              <button className="location-retry-btn" onClick={requestLocationAccess}>
                Retry Location Access
              </button>
            </div>
          )}

          {/* Display live stats */}
          <div className="run-stats">
            <div><p className="stat-number">{formatTime(duration)}</p><p className="stat-label">Duration (s)</p></div>
            <div><p className="stat-number">{distance.toFixed(2)}</p><p className="stat-label">Distance (mi)</p></div>
            <div><p className="stat-number">{pace}</p><p className="stat-label">Pace (min/mi)</p></div>
            <div><p className="stat-number">{avgPace}</p><p className="stat-label">Avg Pace (min/mi)</p></div>
            <div><p className="stat-number">{calories}</p><p className="stat-label">Calories (kcal)</p></div>
          </div>

          {/* Google Map displaying user location and planned route */}
          {isLoaded && currentLocation ? (
            <div className="map-container">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={15}
                onLoad={onLoad}
              >
                {/* Route markers */}
                {plannedRoute && (
                <>
                  <MarkerF
                    position={plannedRoute.start}
                    icon={{ url: '/startpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                  />
                  <MarkerF
                    position={plannedRoute.end}
                    icon={{ url: '/endpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                  />
                </>
              )}
                {/* Live position marker */}
                { /*path.length !== 2 && currentLocation && (
                  <MarkerF
                    position={currentLocation}
                    icon={{ url: '/shoeonmap.png', scaledSize: new window.google.maps.Size(40, 40) }}
                  />
                ) */}

                {!plannedRoute && currentLocation && (
                  <MarkerF
                    position={currentLocation}
                    icon={{ url: '/shoeonmap.png', scaledSize: new window.google.maps.Size(40, 40) }}
                  />
                )}

                {/* Road-snapped polyline */}
                {directionsPath && (
                  <Polyline path={directionsPath} options={{ strokeColor: '#30B0C7', strokeWeight: 4 }} />
                )}
                {path.length > 1 && !plannedRoute && (
                  <Polyline path={path} options={{ strokeColor: '#FF5733', strokeWeight: 3 }} />
                )}

              </GoogleMap>
            </div>
          ) : (
            <p>Loading map...</p>
          )}

          {/* Center map button */}
          <button className="center-map-btn" onClick={centerMap} disabled={!mapRef.current || !currentLocation}>
            Center Map on My Location
          </button>

          {/* Spotify Integration Section */}
          <div className="spotify-section">
            <h2 className="spotify-title">Run Radio</h2>

            {/* Spotify player embed */}
            <SpotifyPlayer playlistId={selectedPlaylist || '37i9dQZF1DXcBWIGoYBM5M'} />

            {/* Load Playlist by URL */}
            <LoadPlaylistInput onLoad={setSelectedPlaylist} />

            <hr className="spotify-divider" />

            {/* Playlist selector for logged-in users */}
            {spotifyToken ? (
              <>
                <SpotifyLogin />
                <PlaylistSelector onSelect={setSelectedPlaylist} />
              </>
            ) : (
              <>
                <p className="spotify-status">Connect to Spotify to see your playlists</p>
                <SpotifyLogin />
              </>
            )}
          </div>
        </div>
      </main>
      <FooterLogged />
    </div>
  );
}

export default Run;

