import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, fontSize, setFontSize, isContrast, setIsContrast, onLogout, userName, setIsDebugOpen }) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'chat', label: 'Study Chat', icon: '💬' },
    { id: 'profile', label: 'User Profile', icon: '👤' }
  ];

  return (
    <aside className="sidebar" role="navigation" aria-label="Main Navigation">
      <div className="sidebar-brand">
        <div className="brand-icon">🧠</div>
        <h2 className="brand-name">Neuro-AI</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="a11y-section">
          <p className="a11y-title">Accessibility</p>
          <div className="a11y-controls">
            <button 
              onClick={() => setFontSize(prev => Math.min(prev + 0.1, 1.4))}
              title="Increase Text Size"
              aria-label="Increase text size"
            >
              A+
            </button>
            <button 
              onClick={() => setFontSize(prev => Math.max(prev - 0.1, 0.8))}
              title="Decrease Text Size"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button 
              className={isContrast ? 'active-toggle' : ''}
              onClick={() => setIsContrast(!isContrast)}
              title="Toggle High Contrast"
              aria-label="Toggle high contrast mode"
            >
              🌓
            </button>
          </div>
        </div>

        <button 
          className="debug-toggle-btn" 
          onClick={() => setIsDebugOpen(true)}
          title="Show Technical AI Logs"
        >
          🔍 View AI Process
        </button>
        
        <div className="user-short-profile">
          <div className="mini-avatar">{userName ? userName[0].toUpperCase() : 'U'}</div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <button className="logout-link" onClick={onLogout}>Log Out</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;