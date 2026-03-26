import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import Profile from './components/Profile'
import Auth from './components/Auth'
import './App.css'

import DebugPanel from './components/DebugPanel'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  
  // Debug State
  const [debugData, setDebugData] = useState({ request: {}, response: {}, profile: 'default', latency: 0 });
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Accessibility State
  const [fontSize, setFontSize] = useState(1);
  const [isContrast, setIsContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSize);
    document.documentElement.setAttribute('data-theme', isContrast ? 'contrast' : 'light');
  }, [fontSize, isContrast]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  const userName = user ? user.name : 'Learner';

  return (
    <div className="app-shell">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        fontSize={fontSize}
        setFontSize={setFontSize}
        isContrast={isContrast}
        setIsContrast={setIsContrast}
        onLogout={handleLogout}
        userName={userName}
        setIsDebugOpen={setIsDebugOpen}
      />
      
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard userName={userName} />}
        {activeTab === 'chat' && <ChatInterface setDebugData={setDebugData} />}
        {activeTab === 'profile' && <Profile onLogout={handleLogout} user={user} />}
      </main>

      <DebugPanel 
        debugData={debugData} 
        isOpen={isDebugOpen} 
        onClose={() => setIsDebugOpen(false)} 
      />
    </div>
  )
}


export default App