//src/pages/Dashboard.js
//user's homepage
//displays the user's running stats in a calendar or list view and allows viewing, deleting, and starting new runs

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import './Dashboard.css';

//list of month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Dashboard() {
  const today = new Date();
  const navigate = useNavigate();

  //state for tracking calendar selection and view
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarSlots, setCalendarSlots] = useState([]);

  //state for view toggling and stats
  const [view, setView] = useState('stats'); //'stats' = calendar, 'list' = run history
  const [stats, setStats] = useState({ distance: 0, duration: 0, calories: 0, workouts: 0 });

  //state for saved runs and deletion handling
  const [runList, setRunList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRunIndex, setSelectedRunIndex] = useState(null);

  //build calendar slot structure (null placeholders for days before the 1st)
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const slots = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
      if (i < firstDay) return null;
      return i - firstDay + 1;
    });
    setCalendarSlots(slots);
  }, [currentMonth, currentYear]);

  //load run data from localStorage and compute monthly stats
  useEffect(() => {
    const loadRuns = () => {
      const email = localStorage.getItem('loggedInUser');
      const runs = JSON.parse(localStorage.getItem(`runs-${email}`)) || [];

      //filter for runs in the current month/year
      const monthlyRuns = runs.filter((run) => {
        const date = new Date(run.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      //aggregate monthly totals
      const distance = monthlyRuns.reduce((sum, r) => sum + parseFloat(r.distance), 0);
      const duration = monthlyRuns.reduce((sum, r) => sum + r.duration, 0);
      const calories = monthlyRuns.reduce((sum, r) => sum + r.calories, 0);

      //set stats and update view
      setStats({
        distance: distance.toFixed(2),
        duration,
        calories,
        workouts: monthlyRuns.length,
      });

      setRunList(monthlyRuns.reverse());
    };

    loadRuns();
  }, [currentMonth, currentYear]);

  //move calendar to next or previous month
  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    }
    setSelectedDay(1);
  };

  //trigger confirmation modal for deleting a run
  const confirmDeleteRun = (idx) => {
    setSelectedRunIndex(idx);
    setShowDeleteModal(true);
  };

  //confirm run deletion and update localStorage + state
  const handleDeleteConfirmed = () => {
    const email = localStorage.getItem('loggedInUser');
    const storedRuns = JSON.parse(localStorage.getItem(`runs-${email}`)) || [];
    const runToDelete = runList[selectedRunIndex];

    //remove matching run by comparing date + duration
    const updatedAllRuns = storedRuns.filter(
      (r) => !(r.date === runToDelete.date && r.duration === runToDelete.duration)
    );

    //update localStorage
    localStorage.setItem(`runs-${email}`, JSON.stringify(updatedAllRuns));
    setShowDeleteModal(false);
    setSelectedRunIndex(null);

    //refresh UI with updated runs and stats
    const reloadRuns = () => {
      const monthlyRuns = updatedAllRuns.filter((run) => {
        const date = new Date(run.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const distance = monthlyRuns.reduce((sum, r) => sum + parseFloat(r.distance), 0);
      const duration = monthlyRuns.reduce((sum, r) => sum + r.duration, 0);
      const calories = monthlyRuns.reduce((sum, r) => sum + r.calories, 0);

      setStats({
        distance: distance.toFixed(2),
        duration,
        calories,
        workouts: monthlyRuns.length,
      });

      setRunList(monthlyRuns.reverse());
    };

    reloadRuns();
  };

  //cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedRunIndex(null);
  };

  return (
    <div className="page-wrapper">
      <HeaderLogged />
      <main className="auth-page dashboard-main">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Header bar with start button */}
        <div className="toggle-bar">
          <span className="tab-label">MONTHLY VIEW</span>
          <div className="start-run-wrapper">
            <button className="start-run" onClick={() => navigate('/run')}>START A RUN</button>
            <div
              className="trainingplans-tooltipZ"
              data-tooltip="Track a new run session!"
            >
              ?
            </div>
          </div>
        </div>

        <div className="calendar-wrapper">
          {/* Calendar month/year + navigation arrows */}
          <div className="calendar-header">
            <button className="arrow-btn" onClick={() => handleMonthChange('prev')}>←</button>
            <span className="calendar-month">{monthNames[currentMonth]} {currentYear}</span>
            <button className="arrow-btn" onClick={() => handleMonthChange('next')}>→</button>
          </div>

          {/* Tab to switch between calendar view and list view */}
          <div className="view-toggle">
            <button className={`view-tab ${view === 'stats' ? 'active' : ''}`} onClick={() => setView('stats')}>
              CALENDAR
            </button>
            <button className={`view-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
              LIST
            </button>
          </div>

          {view === 'stats' ? (
            <>
              {/* Monthly stats */}
              <div className="stats-bar">
                <div className="stat-block"><p className="stat-number">{stats.distance}</p><p className="stat-label">Distance (mi)</p></div>
                <div className="stat-block"><p className="stat-number">{stats.duration}</p><p className="stat-label">Duration (s)</p></div>
                <div className="stat-block"><p className="stat-number">{stats.calories}</p><p className="stat-label">Calories (kcal)</p></div>
                <div className="stat-block"><p className="stat-number">{stats.workouts}</p><p className="stat-label">Workouts</p></div>
              </div>

              {/* Interactive calendar grid */}
              <div className="calendar-grid">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                  <div key={day} className="calendar-day-name">{day}</div>
                ))}
                <div className="calendar-add-box" onClick={() => navigate('/routeconditions')}>+ Plan a New Run</div>
                {calendarSlots.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${day === selectedDay ? 'selected' : ''} ${day === null ? 'blank' : ''}`}
                    onClick={() => day && setSelectedDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </>
          ) : (

            <div className="run-history-list">
              {runList.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No runs logged this month.</p>
              ) : (
                runList.map((run, idx) => {
                  const date = new Date(run.date);
                  return (
                    <div key={idx} className="run-list-item">
                      <div className="run-list-text">
                        <strong>{date.toDateString()}</strong> – {run.distance} mi, {run.duration}s, {run.calories} kcal
                      </div>
                      <button className="delete-btn" onClick={() => confirmDeleteRun(idx)} title="Delete Run">
                        <img src="/deletebutton.svg" alt="Delete" className="delete-icon" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal: confirm run deletion */}
        {showDeleteModal && selectedRunIndex !== null && (
          <div className="modal-overlay">
            <div className="modal">
              <p style={{ fontWeight: 'bold' }}>Are you sure you want to delete this run?</p>
              <p style={{ margin: '10px 0' }}>
                <strong>{new Date(runList[selectedRunIndex].date).toDateString()}</strong> – {runList[selectedRunIndex].distance} mi, {runList[selectedRunIndex].duration}s, {runList[selectedRunIndex].calories} kcal
              </p>
              <div className="modal-buttons9">
                <button onClick={handleDeleteConfirmed} className="confirm-btn9">Delete</button>
                <button onClick={handleCancelDelete} className="cancel-btn9">Cancel</button>
              </div>
            </div>
          </div>
        )}

      </main>
      <FooterLogged />
    </div>
  );
}

export default Dashboard;
