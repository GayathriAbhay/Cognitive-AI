import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import Profile from './components/Profile'
import './App.css'

function App() {
  // 1. This state controls what is visible on the screen
  const [activeTab, setActiveTab] = useState('dashboard'); 

  // 2. Accessibility State (Accessibility Lead Responsibility)
  const [fontSize, setFontSize] = useState(1);
  const [isContrast, setIsContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSize);
    document.documentElement.setAttribute('data-theme', isContrast ? 'contrast' : 'light');
  }, [fontSize, isContrast]);

  return (
    <div className="app-shell">
      {/* 3. Pass the navigation state to the Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        fontSize={fontSize}
        setFontSize={setFontSize}
        isContrast={isContrast}
        setIsContrast={setIsContrast}
      />
      
      <main className="main-content">
        {/* 4. Conditional Rendering: Only the active tab is visible */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  )
}

export default App