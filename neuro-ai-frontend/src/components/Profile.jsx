import React from 'react';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="avatar-large">G</div>
        <h1>Gayathri</h1>
        <p>Neuro-AI Beta Learner</p>
      </div>

      <div className="settings-grid">
        <section className="settings-group">
          <h2>Learning Preferences</h2>
          <div className="setting-item">
            <span>Default Study Method</span>
            <button className="text-link">Step-by-Step</button>
          </div>
          <div className="setting-item">
            <span>Daily Study Goal</span>
            <button className="text-link">2 Hours</button>
          </div>
        </section>

        <section className="settings-group">
          <h2>Accessibility Defaults</h2>
          <div className="setting-item">
            <span>High Contrast Mode</span>
            <input type="checkbox" />
          </div>
          <div className="setting-item">
            <span>Font Size</span>
            <span>Large</span>
          </div>
        </section>
      </div>
      
      <button className="logout-btn">Log Out</button>
    </div>
  );
};

export default Profile;