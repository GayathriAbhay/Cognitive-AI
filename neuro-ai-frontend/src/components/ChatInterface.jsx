import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

const ChatInterface = () => {
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

  const sendMessage = (msgText) => {
    const textToSubmit = msgText || input;
    if (!textToSubmit.trim()) return;

    // Add User Message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSubmit }]);
    setInput('');
    resetTranscript();

    // AI Response Logic (Neurodivergent-friendly breakdown)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: `Using the ${studyMethod} method: Let me simplify that for you into smaller steps...` 
        }
      ]);
    }, 1000);
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
          <input type="file" id="pdf-upload" accept=".pdf" hidden />
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