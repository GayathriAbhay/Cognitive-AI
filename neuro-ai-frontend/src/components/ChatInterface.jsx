import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

const ChatInterface = (props) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm your AI learning assistant. Upload a PDF or choose a study method to begin! 😊" }
  ]);
  const [input, setInput] = useState('');
  const [studyMethod, setStudyMethod] = useState('step-by-step');
  const scrollRef = useRef(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Sync Voice Transcript to Input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Auto-scroll for new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `📁 Uploaded: ${file.name}` }]);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/ai/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process PDF');

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: data.personalized || data.simplified 
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', text: "Error processing the PDF. Please try again." }]);
    }
  };

  const sendMessage = async (msgText) => {
    const textToSubmit = msgText || input;
    if (!textToSubmit.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSubmit }]);
    setInput('');
    resetTranscript();

    const startTime = Date.now();
    const payload = { text: textToSubmit };

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to fetch AI response');

      const data = await response.json();
      
      // Update Debug Info
      if (typeof props.setDebugData === 'function') {
        props.setDebugData({
          request: payload,
          response: data,
          latency: Date.now() - startTime,
          profile: studyMethod
        });
      }

      const botResponse = (studyMethod === 'step-by-step' && data.personalized) 
        ? data.personalized 
        : data.simplified;

      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: botResponse 
        }
      ]);
    } catch (error) {
      console.error("AI Request Error:", error);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: "I'm sorry, I'm having trouble connecting to the AI brain right now. Please try again! 🧠" 
        }
      ]);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="error">Voice recognition is not supported in this browser.</div>;
  }

  return (
    <div className="chat-container">
      {/* Feature Section: PDF and Learning Method */}
      <header className="chat-controls">
        <div className="method-picker">
          <label htmlFor="method">Method:</label>
          <select id="method" value={studyMethod} onChange={(e) => setStudyMethod(e.target.value)}>
            <option value="step-by-step">Step-by-Step</option>
            <option value="breakdown">Concept Breakdown</option>
            <option value="pathway">Learning Path</option>
          </select>
        </div>
        
        <div className="file-section">
          <input type="file" id="pdf-upload" accept=".pdf" hidden onChange={handleFileUpload} />
          <label htmlFor="pdf-upload" className="upload-btn">📁 Upload PDF</label>
        </div>
      </header>

      {/* Message History */}
      <div className="messages-window" aria-live="polite">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Reusable Input Component */}
      <InputBox 
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        listening={listening}
        startListening={() => SpeechRecognition.startListening({ continuous: true })}
        stopListening={SpeechRecognition.stopListening}
      />
    </div>
  );
};

export default ChatInterface;