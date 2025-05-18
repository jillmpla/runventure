//src/pages/SocialChallenges.js
//allows users to view, update, share, and complete personalized social running challenges

import React, { useState, useEffect, useMemo } from 'react';
import HeaderLogged from '../components/HeaderLogged';
import FooterLogged from '../components/FooterLogged';
import confetti from 'canvas-confetti';
import './SocialChallenges.css';

function SocialChallenges() {
  //get the current user’s email from localStorage
  const userEmail = localStorage.getItem('loggedInUser') || 'you@example.com';
  const LOCAL_KEY = `runventure-challenges-${userEmail}`;

  //default challenge data if none exists
  const defaultChallenges = useMemo(() => [
    {
      id: 1,
      title: 'Run 50 miles this month!',
      progress: 0,
      participants: [userEmail, 'jane@example.com', 'john@example.com'],
    },
    {
      id: 2,
      title: 'Run in 25 city parks!',
      progress: 0,
      participants: [userEmail, 'alice@example.com', 'bob@example.com'],
    },
  ], [userEmail]);  

  const [challenges, setChallenges] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [completionStep, setCompletionStep] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [challengeToUpdate, setChallengeToUpdate] = useState(null);
  const [newProgress, setNewProgress] = useState('');
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const maxTitleLength = 100;
  
  //load challenges from localStorage or initialize with defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      //check if the challenges are loaded correctly
      if (Array.isArray(parsed) && parsed.length > 0) {
        setChallenges(parsed);
      } else {
        //if no data, set the default challenges and store them in localStorage
        setChallenges(defaultChallenges);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultChallenges));
      }
    } catch (err) {
      console.error('Failed to load challenges from localStorage:', err);
      //in case of any error, fallback to default challenges
      setChallenges(defaultChallenges);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultChallenges));
    }
  }, [LOCAL_KEY, defaultChallenges]);  

  //save challenges to localStorage whenever they change
  useEffect(() => {
    //only save challenges to localStorage if there are changes
    if (challenges && challenges.length > 0) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(challenges));
    }
  }, [challenges, LOCAL_KEY]);

  const confirmDelete = (challenge) => {
    setChallengeToDelete(challenge);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    setChallenges((prev) => prev.filter((ch) => ch.id !== challengeToDelete.id));
    setShowDeleteModal(false);
    setChallengeToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setChallengeToDelete(null);
  };

  //open modal, enter progress, submit
  const openUpdateModal = (challenge) => {
    setChallengeToUpdate(challenge);
    setNewProgress('');
    setShowUpdateModal(true);
  };

  const handleProgressSubmit = () => {
    const updated = Math.min(Math.max(parseInt(newProgress, 10), 0), 100);
    setChallenges((prev) =>
      prev.map((ch) =>
        ch.id === challengeToUpdate.id ? { ...ch, progress: updated } : ch
      )
    );
    setShowUpdateModal(false);
    setChallengeToUpdate(null);
    setNewProgress('');
  };

  const handleMarkComplete = () => {
    setCompletionStep('preview');
    setShowUpdateModal(false);
  };

  const handleCompleteConfirm = () => {
    setChallenges((prev) =>
      prev.map((ch) =>
        ch.id === challengeToUpdate.id ? { ...ch, progress: 100 } : ch
      )
    );
    setCompletionStep('celebration');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  };

  const handleCompleteClose = () => {
    setCompletionStep(null);
    setChallengeToUpdate(null);
  };

  //show participants for a challenge
  const openParticipantsModal = (challenge) => {
    setChallengeToUpdate(challenge);
    setShowParticipantsModal(true);
  };

  const openShareModal = () => {
    setShowParticipantsModal(false);
    setShowShareModal(true);
    setCopiedLink(false);
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/socialchallenges?challengeId=${challengeToUpdate?.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
  };

  //add a new custom challenge
  const handleAddCustomChallenge = () => {
    setShowAddModal(true);
    setNewChallengeTitle('');
  };

  const handleAddChallengeSubmit = () => {
    if (newChallengeTitle.trim() === '') return;
    const newChallenge = {
      id: Date.now(),
      title: newChallengeTitle.trim(),
      progress: 0,
      participants: [userEmail],
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    setShowAddModal(false);
    setNewChallengeTitle('');
  };

  //render the full page with header, challenge list, modals
  return (
    <div className="page-wrapper">
      <HeaderLogged />
      <main className="auth-page dashboard-main">
        <h1 className="dashboard-title">Social Challenges</h1>

        <div className="toggle-bar">
          <span className="tab-label">MY CHALLENGES</span>
          <button className="btn-outline add-custom-btn" onClick={handleAddCustomChallenge}>
            + Add Custom
          </button>
        </div>

        <div className="challenge-list">
            {challenges.map((challenge, index) => (
                <React.Fragment key={challenge.id}>
                <div className="challenge-card">
                    <button className="delete-btn" onClick={() => confirmDelete(challenge)}>
                    <img src="/deletebutton.svg" alt="Delete" className="delete-icon" />
                    </button>

                    <div className="challenge-title">{challenge.title}</div>

                    <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${challenge.progress}%` }}
                        data-complete={challenge.progress === 100}
                    >
                        <span>{challenge.progress}%</span>
                    </div>
                    </div>

                    <div className="challenge-controls">
                    <button className="update-btn" onClick={() => openUpdateModal(challenge)}>
                        UPDATE
                    </button>
                    </div>

                    <div className="challenge-footer">
                    <button
                    className="btn-outline share-btn"
                    onClick={() => {
                        setChallengeToUpdate(challenge);
                        setTimeout(() => openShareModal(), 0);
                    }}
                    >
                    Share
                    </button>

                    <button className="btn-outline see-btn" onClick={() => openParticipantsModal(challenge)}>
                        See Participants
                    </button>
                    </div>
                </div>
                {index !== challenges.length - 1 && (
                    <div className="challenge-divider">
                    <img src="handshake.png" alt="divider icon" />
                    </div>
                )}
                </React.Fragment>
            ))}
        </div>

        {/* Delete Modal */}
        {showDeleteModal && challengeToDelete && (
          <div className="modal-overlay">
            <div className="modal">
              <p style={{ fontWeight: 'bold' }}>Delete this challenge?</p>
              <p style={{ margin: '10px 0' }}>
                <strong>{challengeToDelete.title}</strong>
              </p>
              <div className="modal-buttons1">
                <button onClick={handleDeleteConfirmed} className="confirm-btn1">
                  Delete
                </button>
                <button onClick={handleCancelDelete} className="cancel-btn1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdateModal && challengeToUpdate && (
          <div className="modal-overlay">
            <div className="modal update-modal">
              <button className="close-update" onClick={() => setShowUpdateModal(false)}>
                ×
              </button>
              <h2>Update Progress or Complete the Challenge?</h2>
              <div className="challenge-icon_update"><img src="runupdate.png" alt="update icon" /></div>
              <div className="challenge-preview">
                <div className="challenge-title">{challengeToUpdate.title}</div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${challengeToUpdate.progress}%` }}
                    data-complete={challengeToUpdate.progress === 100}
                  >
                    <span>{challengeToUpdate.progress}%</span>
                  </div>
                </div>
                <div className="update-input-section">
                  <label htmlFor="progressInput">Update Progress</label>
                  <input
                    id="progressInput"
                    type="number"
                    placeholder="Enter Percentage %"
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                  />
                  <button onClick={handleProgressSubmit} className="confirm-btn">
                    SUBMIT
                  </button>
                </div>

                <div className="divider-horizontal"></div> 

                <div className="encouragement">Don’t give up! You’re almost there!</div>
                <button onClick={handleMarkComplete} className="complete-btn">
                  MARK AS COMPLETE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completion Preview Modal */}
        {completionStep === 'preview' && (
          <div className="modal-overlay">
            <div className="modal image-modal">
              <button className="close-update" onClick={() => setCompletionStep(null)}>
                ×
              </button>
              <div className="challenge-icon_updateA">
                <img src="confirm_run.png" alt="confirm icon" />
              </div>
              <p className="confirm-text">
                Are you sure you want to complete the challenge?
              </p>
              <button className="confirm-btn" onClick={handleCompleteConfirm}>
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Celebration Modal */}
        {completionStep === 'celebration' && (
        <div className="modal-overlay">
            <div className="modal image-modal">
            <h2 className="modal-celebrate-text">
                You did it!<br />
                <span className="modal-celebrate-subtext">Challenge Completed!</span>
            </h2>
            <div className="challenge-icon_updateB"><img src="confetti_icon.png" alt="confetti Icon" className="confetti-icon" /></div>
            <button className="complete-btn" onClick={handleCompleteClose}>
                Close
            </button>
            </div>
        </div>
        )}

        {/* Participants Modal */}
        {showParticipantsModal && challengeToUpdate && (
          <div className="modal-overlay">
            <div className="modal participants-modal">
              <button className="close-update" onClick={() => setShowParticipantsModal(false)}>
                ×
              </button>
              <h2>
                <strong>CHALLENGE:</strong>
                <br />
                {challengeToUpdate.title}
              </h2>
              <p style={{ fontWeight: 'bold' }}>Participants:</p>
              {challengeToUpdate.participants.map((name, i) => (
                <p key={i}>
                    <img src="a_user.png" alt="user icon" className="participant-icon" /> {name}
                </p>
              ))}
              <div style={{ marginTop: '20px' }}>
                <button className="share-btn" onClick={openShareModal}>Share</button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay">
            <div className="modal share-modal">
              <button className="close-update" onClick={() => setShowShareModal(false)}>
                ×
              </button>
              <h2>
                <strong>SHARE:</strong>
              </h2>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="share-icon">
              <div className="sharing_icons"><img src="facebook.png" alt="facebook icon" /></div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="share-icon">
              <div className="sharing_icons"><img src="instagram.png" alt="instagram icon" /></div>
              </a>
              <button onClick={copyShareLink} className="share-icon">
              <div className="sharing_icons"><img src="copylink.png" alt="copy link icon" /></div>
              </button>
              {copiedLink && <p>COPIED LINK!</p>}
            </div>
          </div>
        )}

        {/* Add Custom Challenge Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal add-challenge-modal">
              <button className="close-update" onClick={() => setShowAddModal(false)}>
                ×
              </button>
              <h2>Add a Custom Challenge</h2>
              <input
                type="text"
                placeholder="Enter challenge description"
                value={newChallengeTitle}
                onChange={(e) => setNewChallengeTitle(e.target.value)}
                maxLength={maxTitleLength}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <p>{newChallengeTitle.length}/{maxTitleLength} characters</p>
              <button onClick={handleAddChallengeSubmit} className="confirm-btn">
                Add Challenge
              </button>
            </div>
          </div>
        )}
      </main>
      <FooterLogged />
    </div>
  );
}

export default SocialChallenges;
