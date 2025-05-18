//src/pages/PostRun.js
//a post-run summary for the user after they complete a run

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import confetti from 'canvas-confetti';
import './PostRun.css';

//pool of randomized recovery tips with icons
const suggestionPool = [
  { icon: '/stretching.png', message: 'Stretch for 5–10 mins post-run.' },
  { icon: '/snack.png', message: 'Eat a protein-rich snack.' },
  { icon: '/icebath.png', message: 'Consider an ice bath for muscle recovery.' },
  { icon: '/foamroll.png', message: 'Use a foam roller to relax your muscles.' },
  { icon: '/shower.png', message: 'Take a warm shower to aid recovery.' },
  { icon: '/meditate.png', message: 'Take 5 minutes to cool down and breathe.' },
  { icon: '/sleep.png', message: 'Prioritize 7–9 hours of sleep for full recovery.' },
];

function PostRun() {
  const navigate = useNavigate();
  const [highlights, setHighlights] = useState([]); //list of achievement highlights
  const [hydration, setHydration] = useState('');   //hydration message based on duration
  const [randomTips, setRandomTips] = useState([]); //random recovery tips
  const [lastRun, setLastRun] = useState(null);     //the most recent run data

  //launch celebratory confetti animation once on mount
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  //load the latest run data and tips from localStorage
  useEffect(() => {
    const email = localStorage.getItem('loggedInUser');
    const allRuns = JSON.parse(localStorage.getItem(`runs-${email}`)) || [];
    const recentRun = allRuns[allRuns.length - 1];

    //if no run or an invalid run (0 duration), clear all displays
    if (!recentRun || recentRun.duration === 0) {
      setHighlights([]);
      setHydration('');
      setRandomTips([]);
      return;
    }

    setLastRun(recentRun);

    //select 2 random tips from the suggestion pool
    const shuffled = [...suggestionPool].sort(() => 0.5 - Math.random());
    setRandomTips(shuffled.slice(0, 2));
  }, []);

  //analyze the run and calculate highlights and hydration
  useEffect(() => {
    if (!lastRun) return;

    //set up time ranges for weekly and monthly analysis
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    //filter previous runs by date range (including the current run)
    const email = localStorage.getItem('loggedInUser');
    const allRuns = JSON.parse(localStorage.getItem(`runs-${email}`)) || [];
    const runsThisWeek = allRuns.filter(r => new Date(r.date) >= weekAgo);
    const runsThisMonth = allRuns.filter(r => new Date(r.date) >= monthAgo);
    //const toSimpleDate = (isoString) => new Date(isoString).toISOString().split('T')[0];

    //create performance highlights based on recent run
    const newHighlights = [];
    
    //longest run duration this week
    const longestDurationWeek = Math.max(
      0,
      ...runsThisWeek.map(r => r.duration || 0)
    );
    
    if (lastRun.duration === longestDurationWeek && lastRun.duration !== 0) {
      newHighlights.push({ icon: '/clock.png', message: 'Longest run duration this week!' });
    }      
    
    //longest run duration this month
    const longestDurationMonth = Math.max(
      0,
      ...runsThisMonth.map(r => r.duration || 0)
    );
    
    if (lastRun.duration === longestDurationMonth && lastRun.duration !== 0) {
      newHighlights.push({ icon: '/longroad.png', message: 'Longest run duration this month!' });
    }    

    //fastest pace this month
    const fastestPaceMonth = runsThisMonth.reduce((min, r) => {
      if (!r.pace) return min;
      const p = r.pace.split(':').map(Number);
      const paceInSec = p[0] * 60 + p[1];
      return paceInSec < min ? paceInSec : min;
    }, Infinity);
    
    const currentPace = lastRun.pace.split(':').map(Number);
    const currentPaceSec = currentPace[0] * 60 + currentPace[1];
    
    if (currentPaceSec === fastestPaceMonth && currentPaceSec !== 0) {
      newHighlights.push({ icon: '/running_icon.png', message: 'Fastest pace this month!' });
    }    

    setHighlights(newHighlights);

    //generate hydration suggestion based on run duration
    if (lastRun.duration >= 2400) {
      setHydration('Drink at least 1 liter of water!');
    } else if (lastRun.duration >= 1800) {
      setHydration('Drink at least 900ml of water!');
    } else if (lastRun.duration >= 1200) {
      setHydration('Drink at least 750ml of water!');
    } else if (lastRun.duration >= 600) {
      setHydration('Drink at least 600ml of water!');
    } else if (lastRun.duration >= 300) {
      setHydration('Drink at least 400ml of water!');
    } else {
      setHydration(null);
    }
  }, [lastRun]);

  //if no valid run, show fallback screen
  if (!lastRun) {
    return (
      <div className="page-wrapper">
        <HeaderLogged />
        <main className="post-run-page">
          <h1 className="run-complete">No run data found.</h1>
        </main>
        <FooterLogged />
      </div>
    );
  }

  //display post-run summary
  return (
    <div className="page-wrapper">
      <HeaderLogged />
      <main className="post-run-page">
        <div className="summary-wrapper">
          {/* Close button returns to dashboard */}
          <button className="close-btn" onClick={() => navigate('/dashboard')}>✕</button>
          <h1 className="summary-title">Post-Run Summary</h1>
          <img src="/confetti_icon.png" alt="Confetti" className="confetti-burst" />
          <p className="run-date">{new Date(lastRun.date).toLocaleString()}</p>

          <div className="stats-columns">
            {/* Performance Highlights Column */}
            <div className="stat-col side-col">
              <h3 className="column-title">Performance Highlights</h3>
              <ul className="highlight-list">
                {highlights.length ? (
                  highlights.map((item, i) => (
                    <li key={i}>
                      <img src={item.icon} alt="" className="highlight-icon" />
                      <p>{item.message}</p>
                    </li>
                  ))
                ) : (
                  <div className="no-highlights-wrapper">
                    <li>No personal bests this time.</li>
                  </div>
                )}
              </ul>
            </div>

            {/* Core Run Stats Column */}
            <div className="stat-col center-col">
              <h3 className="column-title">Run Statistics</h3>
              <div className="stat-block"><p className="stat-number">{lastRun.duration}s</p><p className="stat-label">Duration (s)</p></div>
              <div className="stat-block"><p className="stat-number">{lastRun.distance}</p><p className="stat-label">Distance (mi)</p></div>
              <div className="stat-block"><p className="stat-number">{lastRun.pace}</p><p className="stat-label">Pace (min/mi)</p></div>
              <div className="stat-block"><p className="stat-number">{lastRun.avgPace}</p><p className="stat-label">Avg Pace (min/mi)</p></div>
              <div className="stat-block"><p className="stat-number">{lastRun.calories}</p><p className="stat-label">Calories (kcal)</p></div>
            </div>

            {/* Personalized Insights Column */}
            <div className="stat-col side-col">
              <h3 className="column-title">Personalized Insights</h3>
              <ul className="highlight-list">
                <li>
                  <img src="/water_icon.png" alt="Hydration" className="highlight-icon" />
                  <p>
                    {hydration ? (
                      <>
                        Hydration Reminder:<br /><br />{hydration}
                      </>
                    ) : (
                      <span className="no-hydration">You must run before needing hydration!</span>
                    )}
                  </p>
                </li>

                {/* Display 2 random post-run recovery tips */}
                {randomTips.map((tip, i) => (
                  <li key={i}>
                    <img src={tip.icon} alt={tip.message} className="highlight-icon" />
                    <p>{tip.message}</p>
                  </li>
                ))}

              </ul>
            </div>
          </div>
        </div>
      </main>
      <FooterLogged />
    </div>
  );
}

export default PostRun;
