import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Features from './pages/Features'
import ChatInterface from './components/ChatInterface'
import Profile from './components/Profile'
import Auth from './components/Auth'
import Onboarding from './components/Onboarding'
import Footer from './components/Footer'
import './App.css'

import DebugPanel from './components/DebugPanel'
import ProgressReport from './components/ProgressReport'

function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Debug State
  const [debugData, setDebugData] = useState({ request: {}, response: {}, profile: 'default', latency: 0 });
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Ref to send quick-action messages into the chat
  const chatSendRef = useRef(null);
  // Remount ProgressReport each time dashboard is opened
  const [dashboardKey, setDashboardKey] = useState(0);

  // Auto-scrolled to top when dashboard is opened
  useEffect(() => {
    if (activeTab === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeTab]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/student/profile`, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const handleOnboardingComplete = () => {
    fetchProfile();
    setActiveTab('home');
  };

  if (loading) {
    return <div className="loading-screen">Preparing your experience...</div>;
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  if (user && !user.is_onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const userName = user ? user.name : 'Learner';

  return (
    <div className="app-shell">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={userName}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'features' && <Features />}
        {activeTab === 'dashboard' && (
          <div className="dashboard-layout">
            <ChatInterface 
              setDebugData={setDebugData} 
              chatSendRef={chatSendRef} 
              onNewChat={() => setDashboardKey(k => k + 1)}
            />
            <aside className="insights-sidebar">
              <div className="insight-card">
                <h3>Your Learning Style</h3>
                <p>Based on your activity, you prefer <strong>Step-by-Step</strong> guidance.</p>
              </div>
              <div className="insight-card">
                <h3>Quick Actions</h3>
                <button
                  className="quick-action-btn"
                  onClick={() => chatSendRef.current && chatSendRef.current('Please simplify this lesson so it is easy to understand step by step.')}
                >📚 Simplify a Lesson</button>
                <button
                  className="quick-action-btn"
                  onClick={() => chatSendRef.current && chatSendRef.current('Please break down this topic into smaller, manageable tasks.')}
                >✅ Break Down Task</button>
                <button
                  className="quick-action-btn"
                  onClick={() => chatSendRef.current && chatSendRef.current('Give me a short quiz or practice questions on what we just discussed.')}
                >🧠 Practice Quiz</button>
              </div>
              <ProgressReport key={dashboardKey} />
            </aside>
          </div>
        )}
        {activeTab === 'profile' && <Profile onLogout={handleLogout} user={user} />}
      </main>

      {activeTab !== 'dashboard' && <Footer />}

      <DebugPanel 
        debugData={debugData} 
        isOpen={isDebugOpen} 
        onClose={() => setIsDebugOpen(false)} 
      />
    </div>
  )
}

export default App