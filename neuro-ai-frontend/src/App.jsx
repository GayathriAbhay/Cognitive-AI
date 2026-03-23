import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: "Welcome! I'm your Neuro-AI tutor. Ready to start today's lesson?" }
  ]);
  const [input, setInput] = useState('');
  const [fontSize, setFontSize] = useState(1);
  const [isContrast, setIsContrast] = useState(false);
  const scrollRef = useRef(null);

  // Apply accessibility settings to the document root
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontSize);
    document.documentElement.setAttribute('data-theme', isContrast ? 'contrast' : 'light');
  }, [fontSize, isContrast]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: "That's a great question. Let's break that down into three simple steps..." 
      }]);
    }, 1000);
  };

  return (
    <div id="root" className="app-shell">
      {/* Accessibility Controls */}
      <header className="a11y-toolbar" role="toolbar" aria-label="Accessibility Settings">
        <div className="btn-group">
          <button onClick={() => setFontSize(f => Math.min(f + 0.1, 1.4))} aria-label="Increase text size">A+</button>
          <button onClick={() => setFontSize(f => Math.max(f - 0.1, 0.8))} aria-label="Decrease text size">A-</button>
        </div>
        <button onClick={() => setIsContrast(!isContrast)}>
          {isContrast ? 'Light Mode' : 'High Contrast'}
        </button>
      </header>

      {/* Main Chat/Lesson Area */}
      <main className="chat-window" aria-live="polite">
        {messages.map((msg) => (
          <article key={msg.id} className={`message-bubble ${msg.role}`}>
            <span className="sr-only">{msg.role === 'user' ? 'You said:' : 'Assistant said:'}</span>
            <p>{msg.text}</p>
          </article>
        ))}
        <div ref={scrollRef} />
      </main>

      {/* Interaction Bar */}
      <footer className="input-container">
        <form onSubmit={handleSend} className="input-form">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            aria-label="Message input"
          />
          <button type="submit" className="send-btn">Send</button>
          <button type="button" className="voice-btn" aria-label="Use voice input">🎤</button>
        </form>
      </footer>
    </div>
  )
}

export default App