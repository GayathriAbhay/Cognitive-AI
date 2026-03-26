import React, { useState, useEffect } from 'react';

const Profile = ({ onLogout }) => {
  const [profileType, setProfileType] = useState('default');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const types = [
    { id: 'default', label: 'Standard', desc: 'Typical learning experience' },
    { id: 'ADHD', label: 'ADHD', desc: 'Focus on quick steps and high contrast' },
    { id: 'ASD', label: 'ASD (Autism)', desc: 'Highly structured and predictable steps' },
    { id: 'Dyslexia', label: 'Dyslexia', desc: 'Simplified text and easy-read formatting' }
  ];

  useEffect(() => {
    // Fetch current settings from backend if needed
    // For now, setting from local or just keeping default
  }, []);

  const saveProfile = async (typeId) => {
    setProfileType(typeId);
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('access_token');
    
    // Mapping our simple IDs to the backend preference model
    // ADHD -> contrast_mode: high
    // ASD -> input_mode: visual
    // Dyslexia -> input_mode: verbal
    const payload = {
      contrast_mode: typeId === 'ADHD' ? 'high' : 'standard',
      input_mode: typeId === 'ASD' ? 'visual' : (typeId === 'Dyslexia' ? 'verbal' : 'text')
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/student/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save preferences');
      setMessage('Profile updated successfully! ✨');
    } catch (err) {
      setMessage('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="avatar-large">G</div>
        <h1>Settings</h1>
        <p>Personalize your AI learning brain</p>
      </div>

      <div className="settings-grid">
        <section className="settings-group full-width">
          <h2>Select Your Learning Profile</h2>
          <p className="subtitle">Choose a profile to help the AI adapt its teaching style to your needs.</p>
          
          <div className="profile-selection-grid">
            {types.map(type => (
              <button 
                key={type.id}
                className={`profile-type-card ${profileType === type.id ? 'active' : ''}`}
                onClick={() => saveProfile(type.id)}
                disabled={loading}
              >
                <h3>{type.label}</h3>
                <p>{type.desc}</p>
              </button>
            ))}
          </div>
          {message && <p className="save-message">{message}</p>}
        </section>

        <section className="settings-group">
          <h2>Account Actions</h2>
          <div className="setting-item">
            <span>Current Session Only</span>
            <button className="text-link" onClick={onLogout}>Log Out</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;