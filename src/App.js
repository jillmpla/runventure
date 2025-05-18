//src/App.js
//defines the main routing structure for the RunVenture app using React Router

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Run from './pages/Run';
import PostRun from './pages/PostRun';
import SpotifyCallback from './pages/SpotifyCallback';
import RouteConditions from './pages/RouteConditions';
import SocialChallenges from './pages/SocialChallenges';
import Training from './pages/Training';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/run" element={<Run />} />
        <Route path="/postrun" element={<PostRun />} />
        <Route path="/spotify-callback" element={<SpotifyCallback />} />
        <Route path="/routeconditions" element={<RouteConditions />} />
        <Route path="/socialchallenges" element={<SocialChallenges />} />
        <Route path="/training" element={<Training />} />
      </Routes>
    </Router>
  );
}

export default App;
