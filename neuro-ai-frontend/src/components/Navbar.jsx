import React from 'react';

const Navbar = ({ activeTab, setActiveTab, userName, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="brand-logo-sq">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/>
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/>
          </svg>
        </div>
        <div className="brand-text-wrapper">
          <span className="brand-title">CogniLearn</span>
          <span className="brand-subtitle">AI Assistant</span>
        </div>
      </div>

      <div className="nav-links">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'features' ? 'active' : ''} 
          onClick={() => setActiveTab('features')}
        >
          Features
        </button>
        <button 
          className={activeTab === 'dashboard' || activeTab === 'chat' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </div>

      <div className="nav-actions">
        <button className="nav-icon-btn" title="User Profile" onClick={() => setActiveTab('profile')}>👤</button>
        <div className="user-profile-mini">
          <span className="user-name">{userName}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
