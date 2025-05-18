//src/pages/TrainingPlans.js
//allows users to manage personalized training plans, including:
//edit and reorder goals, view daily tasks, and view a performance graph of their distance/calories run data

import React, { useState, useEffect, useMemo } from 'react';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import './Training.css';

function TrainingPlans() {
  //gets current user's email
  const userEmail = localStorage.getItem('loggedInUser') || 'you@example.com';

  //shared default goals by plan
  const defaultGoalsByPlan = useMemo(() => ({
    beginner: ['Complete your first 5K', 'Jog 3x per week consistently'],
    intermediate: ['Improve 5K time by 2 minutes', 'Complete weekly long runs'],
    advanced: ['Run a sub-50 min 10K', 'Incorporate structured speedwork'],
    trail: ['Build endurance for trail adventures', 'Increase elevation and terrain diversity'],
    speed: ['Improve sprint speed and footwork', 'Add explosive movement to weekly training'],
    marathon: ['Complete a full marathon', 'Build endurance & recovery routine']
  }), []);

  //state for goals, tasks, modals, selected plan, and run graph data
  const [newGoal, setNewGoal] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('beginner');
  const [goalList, setGoalList] = useState([]);
  const [runData, setRunData] = useState([]);
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);
  const [goalToDeleteIndex, setGoalToDeleteIndex] = useState(null);
  const [tempSelectedPlan, setTempSelectedPlan] = useState('beginner');
  const [tempGoalList, setTempGoalList] = useState([]);

  //default training plans
  const plans = useMemo(() => ({
    beginner: [
      'Day 1 – Brisk Walk 5 min → Jog 1 min + Walk 2 min (repeat x5)',
      'Day 2 – Cross-training (yoga, cycling, or strength)',
      'Day 3 – Walk 5 min → Jog 2 min + Walk 2 min (repeat x4)',
      'Day 4 – Rest or gentle stretching',
      'Day 5 – Walk 5 min → Jog 3 min + Walk 2 min (repeat x3)',
      'Day 6 – Bodyweight strength or core workout',
      'Day 7 – Rest & reflect'
    ],
    intermediate: [
      'Day 1 – Jog 10 min → Run 2 min + Jog 1 min (repeat x5)',
      'Day 2 – Tempo run (20–25 min, moderate pace)',
      'Day 3 – Jog 5 min → Run 4 min + Jog 1 min (repeat x4)',
      'Day 4 – Rest or yoga session',
      'Day 5 – Long run (3–4 miles)',
      'Day 6 – Cross-training (HIIT or cycling)',
      'Day 7 – Light jog or walk'
    ],
    advanced: [
      'Day 1 – Interval Run: 8x 400m at race pace',
      'Day 2 – Tempo Run (30–35 min)',
      'Day 3 – Fartlek session: Run 3 min fast + 2 min easy (x5)',
      'Day 4 – Strength or hill sprints',
      'Day 5 – Long run (5–7 miles)',
      'Day 6 – Cross-train or easy recovery run',
      'Day 7 – Rest'
    ],
    trail: [
      'Day 1 – Hilly trail jog or hike (45 min)',
      'Day 2 – Strength (bodyweight + balance focus)',
      'Day 3 – Trail Intervals: Run 2 min + Walk 2 min (repeat x6)',
      'Day 4 – Rest or nature walk',
      'Day 5 – Long trail session (60+ min varied pace)',
      'Day 6 – Cross-train (bike, stairs, row)',
      'Day 7 – Flex day: hike, jog, or stretch'
    ],
    speed: [
      'Day 1 – Sprint Intervals: 10x 30s sprints + 90s walk',
      'Day 2 – Agility Drills (ladder, cones, jumps)',
      'Day 3 – Core & Mobility Circuit',
      'Day 4 – Rest or active recovery',
      'Day 5 – Hill Sprints (6x uphill 20s)',
      'Day 6 – Strength Training (legs + explosive movements)',
      'Day 7 – Long Jog (2–3 miles steady pace)'
    ],
    marathon: [
      'Day 1 – Run 3 miles (easy)',
      'Day 2 – Strength training',
      'Day 3 – Intervals (5x 800m)',
      'Day 4 – Tempo Run (5 miles)',
      'Day 5 – Rest',
      'Day 6 – Long run (8–10 miles)',
      'Day 7 – Recovery run or rest'
    ]
  }), []);

  //confirms new plan
  const handleConfirmPlan = () => {
    setSelectedPlan(tempSelectedPlan);
    localStorage.setItem(`runventure-selected-plan-${userEmail}`, tempSelectedPlan);

    //resets goals to default for new plan
    const newGoals = defaultGoalsByPlan[tempSelectedPlan] || ['Train with purpose', 'Stay consistent each day'];
    const newKey = `runventure-goals-${userEmail}-${tempSelectedPlan}`;
    localStorage.setItem(newKey, JSON.stringify(newGoals));
    setGoalList(newGoals);

    //clears the goal input field so leftover edits don't appear
    setNewGoal('');
    setShowTasksModal(false);
  };

  //on initial load, set or restore the user's selected plan and goals from localStorage 
  //(defaults to beginner if new user)
  useEffect(() => {
    const storedPlan = localStorage.getItem(`runventure-selected-plan-${userEmail}`) || 'beginner';
    const goalsKey = `runventure-goals-${userEmail}-${storedPlan}`;
    const storedGoals = localStorage.getItem(goalsKey);
  
    setSelectedPlan(storedPlan);
  
    if (!storedGoals || JSON.parse(storedGoals).length === 0) {
      const defaultGoals = defaultGoalsByPlan[storedPlan];
      localStorage.setItem(goalsKey, JSON.stringify(defaultGoals));
      setGoalList(defaultGoals);
    } else {
      setGoalList(JSON.parse(storedGoals));
    }
  }, [userEmail, defaultGoalsByPlan]);  

  //save goal list to localStorage
  useEffect(() => {
    if (!selectedPlan) return;
    const key = `runventure-goals-${userEmail}-${selectedPlan}`;
    localStorage.setItem(key, JSON.stringify(goalList));
  }, [goalList, selectedPlan, userEmail]);

  //update daily tasks based on selected plan
  useEffect(() => {
    setDailyTasks(plans[selectedPlan]);
  }, [selectedPlan, plans]);

  //load run stats from localStorage for graph
  useEffect(() => {
    const runs = JSON.parse(localStorage.getItem(`runs-${userEmail}`)) || [];
    const formatted = runs.map((run) => ({
      date: new Date(run.date).toLocaleDateString(),
      distance: parseFloat(run.distance),
      duration: run.duration,
      calories: run.calories
    })).reverse();
    setRunData(formatted);
  }, [userEmail]);

  //when the plan selection modal opens:
  //initialize the temporary selected plan with the current one
  useEffect(() => {
    if (showTasksModal) {
      setTempSelectedPlan(selectedPlan);
    }
  }, [showTasksModal, selectedPlan]);

  //when the goal editing modal opens:
  //initialize the temporary goal list with the current goals so changes can be discarded if not saved
  useEffect(() => {
    if (showGoalModal) {
      setTempGoalList([...goalList]);
    }
  }, [showGoalModal, goalList]);

  //delete a goal by index
  const handleDeleteGoal = (index) => {
    setGoalList((prev) => prev.filter((_, i) => i !== index));
  };

  //start dragging goal
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('dragIndex', index);
  };

  //drop goal to new position
  const handleDrop = (e, dropIndex, list = goalList, setList = setGoalList) => {
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
    if (dragIndex === dropIndex) return;
    const updated = [...list];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setList(updated);
  };

  //capitalize plan name
  const formatPlanTitle = (planKey) => `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} Plan`;

  return (
    <div className="page-wrapper">
      <HeaderLogged />
      <main className="auth-page dashboard-main">

        <h1 className="dashboard-titleTP">Training Plan</h1>
        <div className="dashboard-titleTP">
          <h2 className="trainingplans-tab-labelTP">{formatPlanTitle(selectedPlan)}</h2>
        </div>

        <div className="trainingplans-box-wrapper">
          <div className="trainingplans-edit-button-absolute">
            <button className="trainingplans-edit-button" onClick={() => setShowTasksModal(true)}>+ Edit</button>
          </div>

          {/* Goals */}
          <div className="trainingplans-goal-center">
            <div className="trainingplans-goal-list">
              {goalList.length > 0 ? (
                goalList.map((goal, i) => (
                  <div key={i} className="trainingplans-goal-item">
                    <span className="trainingplans-goal-badge">GOAL</span>
                    <span>{goal}</span>
                    <button
                      className="trainingplans-edit-icon"
                      onClick={() => setShowGoalModal(true)}
                      aria-label={`Edit goal ${i + 1}`}
                    >
                      ✎
                    </button>
                  </div>
                ))
              ) : (
                <div className="trainingplans-goal-item">
                  <span className="trainingplans-goal-badge">GOAL</span>
                  <em>No goals currently</em>
                  <button
                    className="trainingplans-edit-icon"
                    onClick={() => setShowGoalModal(true)}
                    aria-label="Edit goals"
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Daily Tasks + Chart */}
          <div className="trainingplans-breakdown">
            <div className="trainingplans-daily-tasks">
            <h3>
              Daily Tasks
              <span
                className="trainingplans-tooltip"
                data-tooltip="Recommended daily activities."
              >
                ?
              </span>
            </h3>
              <ul>
                {dailyTasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>

            <div className="trainingplans-performance-graph">
              <h3>
                Performance Graph 
                <span className="trainingplans-tooltip" data-tooltip="Distance and calorie trends.">?</span>
              </h3>

              <div className="performance-graph-wrapper">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={runData}
                    margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis width={40} />
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" height={20} />
                    <Line type="monotone" dataKey="distance" stroke="#30B0C7" name="Distance (mi)" />
                    <Line type="monotone" dataKey="calories" stroke="#2e9f75" name="Calories (kcal)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Editing Modal */}
        {showGoalModal && (
          <div className="trainingplans-modal-overlay">
            <div className="trainingplans-modal">

              {/* Close modal and discard changes */}
              <button
                className="trainingplans-close-btn"
                onClick={() => {
                  setTempGoalList([]);
                  setNewGoal('');
                  setShowGoalModal(false);
                }}
              >
                ×
              </button>

              <div className="trainingplans-heading-wrapper">
                <h2 style={{ textAlign: 'right' }}>{formatPlanTitle(selectedPlan)}</h2>
              </div>

              {/* Render editable goals */}
              {tempGoalList.map((g, i) => (
                <div
                  key={i}
                  className="trainingplans-goal-group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, i, tempGoalList, setTempGoalList)}
                >
                  <label>GOAL</label>
                  <div className="trainingplans-goal-row">
                    <span className="trainingplans-drag-icon">☰</span>
                    <input
                      type="text"
                      value={g}
                      maxLength={100}
                      onChange={(e) => {
                        const updated = [...tempGoalList];
                        updated[i] = e.target.value;
                        setTempGoalList(updated);
                      }}
                    />

                    <button
                      className="trainingplans-delete-goal-btn"
                      onClick={() => {
                        setGoalToDeleteIndex(i);            
                        setShowDeleteGoalModal(true);       
                      }}
                      title="Delete this goal"
                    >
                      🗑
                    </button>

                    <span className="char-count">{g.length}/100</span>
                  </div>
                </div>
              ))}

              {/* Add a new goal */}
              <div className="trainingplans-goal-group">
                <label>GOAL</label>
                <div className="trainingplans-goal-row">
                  <input
                    type="text"
                    placeholder="Add a new goal"
                    value={newGoal}
                    maxLength={100}
                    onChange={(e) => setNewGoal(e.target.value)}
                  />
                  <span className="char-count">{newGoal.length}/100</span>
                </div>
              </div>

              {/* Modal action buttons */}
              <div className="goal-button-row">
                <button
                  onClick={() => {
                    if (newGoal.trim()) {
                      setTempGoalList([...tempGoalList, newGoal.trim()]);
                      setNewGoal('');
                    }
                  }}
                  className="trainingplans-add-goal-btn"
                >
                  ＋ Add
                </button>

                <button
                  className="trainingplans-confirm-btn"
                  onClick={() => {
                    setGoalList(tempGoalList);
                    setNewGoal('');
                    setShowGoalModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Selection Modal */}
        {showTasksModal && (
          <div className="trainingplans-modal-overlay">
            <div className="trainingplans-modal">
              <button className="trainingplans-close-btn" onClick={() => setShowTasksModal(false)}>×</button>
              <div className="trainingplans-heading-wrapper"><h2>Select Plan</h2></div>

              <div className="trainingplans-plan-options">
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'beginner' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('beginner')}>Beginner</button>
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'intermediate' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('intermediate')}>Intermediate</button>
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'advanced' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('advanced')}>Advanced</button>
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'trail' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('trail')}>Trail Training</button>
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'speed' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('speed')}>Speed and Agility</button>
                <button className={`trainingplans-plan-btnTP ${tempSelectedPlan === 'marathon' ? 'selected' : ''}`}onClick={() => setTempSelectedPlan('marathon')}>Marathon Prep</button>
              </div>
              <button className="confirm-btn-TP" onClick={handleConfirmPlan}>Confirm</button>
            </div>
          </div>
        )}

        {/* Confirm Delete Goal */}
        {showDeleteGoalModal && goalToDeleteIndex !== null && (
          <div className="trainingplans-modal-overlay">
            <div className="trainingplans-modal">
              <p style={{ fontWeight: 'bold' }}>Are you sure you want to delete this goal?</p>
              <p style={{ margin: '10px 0' }}>
                <em>{goalList[goalToDeleteIndex]}</em>
              </p>
              <div className="modal-buttons14">
                <button
                  onClick={() => {
                    handleDeleteGoal(goalToDeleteIndex);
                    setShowDeleteGoalModal(false);
                    setGoalToDeleteIndex(null);
                  }}
                  className="confirm-btn14"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteGoalModal(false);
                    setGoalToDeleteIndex(null);
                  }}
                  className="cancel-btn14"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
      <FooterLogged />
    </div>
  );
}

export default TrainingPlans;
