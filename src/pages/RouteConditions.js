//src/pages/RouteConditions.js
//uses the Geolocation API (W3C), Google Maps JavaScript API, Google Maps Directions API,
//and Google Maps Elevation API to let users select a route, view conditions, and confirm it for tracking in Run.js

import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, MarkerF, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import './RouteConditions.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const fallbackCenter = {
  lat: 35.305,
  lng: -80.733,
};

//calculates the Haversine distance between two lat/lng points in miles
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

//fetches elevation in feet for a given lat/lng
const fetchElevation = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();
    if (data.status === 'OK') {
      return Math.round(data.results[0].elevation * 3.28084);
    }
  } catch (err) {
    console.error('Elevation API error:', err);
  }
  return 100;
};

function RouteConditions() {
  const navigate = useNavigate();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [step, setStep] = useState('getLocation');
  const [locationError, setLocationError] = useState(false);
  const [directionsPath, setDirectionsPath] = useState(null);
  const hasConfirmedRef = useRef(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'], //needed for DirectionsService and path decoding
  });

  //request user's current location when component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setStep('selectStart');
      },
      () => {
        setUserLocation(fallbackCenter);
        setLocationError(true);
        setStep('selectStart');
      },
      { enableHighAccuracy: true }
    );
  }, []);

  //fetch route path using DirectionsService when both points are selected
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

  //when both start and end points are selected, calculate route data
  useEffect(() => {
    if (start && end && window.google?.maps?.DirectionsService) {
      const midLat = (start.lat + end.lat) / 2;
      const midLng = (start.lng + end.lng) / 2;
      const routeLength = getDistance(start.lat, start.lng, end.lat, end.lng).toFixed(2);

      getRouteViaClient(start, end);

      fetchElevation(midLat, midLng).then((elev) => {
        const distanceScore = routeLength < 1 ? 2 : routeLength < 3 ? 4 : 6;
        const elevationScore = elev < 100 ? 2 : elev < 300 ? 4 : 6;
        const difficultyScore = distanceScore + elevationScore;
        const difficulty = difficultyScore < 5 ? 'Easy' : difficultyScore < 9 ? 'Medium' : 'Hard';
        const effort = `${Math.min(10, Math.floor(difficultyScore))}/10`;

        //placeholder values for future API integration (e.g., OpenWeatherMap)
        const weather = ['Sunny', 'Cloudy', 'Windy', 'Humid'][Math.floor(Math.random() * 4)];
        const airQuality = ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)];

        const surfaces = ['Pavement', 'Grass', 'Gravel', 'Trail'];
        const surfaceType = surfaces[Math.floor(Math.random() * surfaces.length)];
        const trafficOptions = ['Low', 'Medium', 'High'];
        const trafficLevel = trafficOptions[Math.floor(Math.random() * trafficOptions.length)];

        setRouteData({
          distance: routeLength,
          elevation: elev,
          difficulty,
          effort,
          surfaceType,
          trafficLevel,
          weather,      //planned to replace with live data
          airQuality    //planned to replace with live data
        });

        setStep('showConditions');
      });
    }
  }, [start, end]);

  //clear data if user navigates away without confirming the run
  useEffect(() => {
    const clearRouteData = () => {
      if (!hasConfirmedRef.current) {
        localStorage.removeItem('plannedRoute');
      }
    };
    window.addEventListener('beforeunload', clearRouteData);
    return () => {
      clearRouteData();
      window.removeEventListener('beforeunload', clearRouteData);
    };
  }, []);  

  //navigate to Run.js only after confirmation
  const handleConfirm = () => {
    hasConfirmedRef.current = true;
    localStorage.setItem('plannedRoute', JSON.stringify({ start, end }));
    navigate('/run');
  };  

  const handleReset = () => {
    setStart(null);
    setEnd(null);
    setRouteData(null);
    setDirectionsPath(null);
    setStep('selectStart');
  };

  const handleBackToDashboard = () => {
    localStorage.removeItem('plannedRoute');
    navigate('/dashboard');
  };

  const requestLocationAccess = () => window.location.reload();

  return (
    <div className="page-wrapper">
      <HeaderLogged />
  
      {/* Modal overlay for location and route selection */}
      {(step === 'getLocation' || step === 'selectStart' || step === 'selectEnd') && (
        <div className="modal-overlay fade-in">
          <div className="modal-map-box">
            {/* Close modal (return to dashboard) */}
            <button className="close-modal-btn" onClick={handleBackToDashboard}>✕</button>
  
            {/* Dynamic title based on current step */}
            <h2 className="modal-title">
              {step === 'getLocation' && 'Requesting Location...'}
              {step === 'selectStart' && 'Tap to select your starting point:'}
              {step === 'selectEnd' && 'Tap to select your destination:'}
            </h2>
  
            {/* If location access fails */}
            {locationError && step === 'selectStart' && (
              <div className="location-error">
                Location access denied.
                <button className="location-retry-btn" onClick={requestLocationAccess}>Retry Location Access</button>
              </div>
            )}
  
            {/* Render Google Map with click handlers for start/end points */}
            {isLoaded && userLocation && (
              <div className="map-container">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={userLocation}
                  zoom={15}
                  onClick={(e) => {
                    const clicked = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    if (step === 'selectStart') {
                      setStart(clicked);
                      setStep('selectEnd');
                    } else if (step === 'selectEnd') {
                      setEnd(clicked);
                    }
                  }}
                >
                  {start && (
                    <MarkerF
                      position={start}
                      icon={{ url: '/startpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                  )}
                  {end && (
                    <MarkerF
                      position={end}
                      icon={{ url: '/endpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                  )}
                  {start && end && directionsPath && (
                    <Polyline path={directionsPath} options={{ strokeColor: '#30B0C7', strokeWeight: 4 }} />
                  )}
                </GoogleMap>
              </div>
            )}
  
            {/* Reset selection button inside modal */}
            <button className="reset-route-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>
      )}
  
      {/* Main page content for showing route conditions */}
      <main className="route-conditions-page">
        {/* Header section */}
        <div className="route-header-block1">
          <h1 className="route-title1">Route Conditions</h1>
          <span className="route-label1">SELECTED ROUTE OVERVIEW</span>
        </div>
  
        {/* Data summary and map once route is selected */}
        <div className="page-overall-block">
          {step === 'showConditions' && routeData && (
            <>
              {/* Summary of difficulty, surface, etc. */}
              <div className="route-summary">
                <div className="condition-tags">
                  <div className="condition-box">
                    <span className={`condition-value difficulty-${routeData.difficulty.toLowerCase()}`}>
                      {routeData.difficulty}
                    </span>
                    <div className="condition-label">Difficulty</div>
                  </div>
  
                  <div className="condition-box">
                    <span className="condition-value">{routeData.surfaceType}</span>
                    <div className="condition-label">Surface Type</div>
                  </div>
  
                  <div className="condition-box">
                    <span className="condition-value">{routeData.elevation}</span>
                    <div className="condition-label">Elevation (ft)</div>
                  </div>
  
                  <div className="condition-box">
                    <span className="condition-value">{routeData.trafficLevel}</span>
                    <div className="condition-label">Traffic Level</div>
                  </div>
  
                  <div className="condition-box">
                    <span className="condition-value">{routeData.effort}</span>
                    <div className="condition-label">Effort</div>
                  </div>
                </div>
  
                {/* Tags describing the route */}
                <div className="user-tags">
                  <span className="tag">FUN</span>
                  <span className="tag">PEACEFUL</span>
                </div>
              </div>
  
              {/* Map preview of route on confirmation screen */}
              <div className="map-container">
                <GoogleMap mapContainerStyle={containerStyle} center={start} zoom={15}>
                  {start && (
                    <MarkerF
                      position={start}
                      icon={{ url: '/startpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                  )}
                  {end && (
                    <MarkerF
                      position={end}
                      icon={{ url: '/endpin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                    />
                  )}
                  {start && end && directionsPath && (
                    <Polyline path={directionsPath} options={{ strokeColor: '#30B0C7', strokeWeight: 4 }} />
                  )}
                </GoogleMap>
              </div>
  
              {/* Confirm button to move to Run.js */}
              <button className="confirm-btn-rc" onClick={handleConfirm}>CONFIRM RUN</button>
            </>
          )}
        </div>
      </main>
  
      <FooterLogged />
    </div>
  );  
}

export default RouteConditions;

