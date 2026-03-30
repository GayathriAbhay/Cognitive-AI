import React, { useRef } from "react";

export default function InputBox({ input, setInput, sendMessage, listening, startListening, stopListening, onFileUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="input-container">
      <div className="input-row">
        <input 
          type="file" 
          accept=".pdf" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button 
          className="attach-btn" 
          onClick={() => fileInputRef.current?.click()}
          title="Attach a PDF document"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <button 
          className={`voice-btn ${listening ? 'active' : ''}`}
          onClick={listening ? stopListening : startListening}
          title={listening ? "Stop listening" : "Start voice input"}
        >
          {listening ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          )}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about your lessons..."
          aria-label="Ask your question"
        />
        <button 
          className="send-btn" 
          onClick={handleSend}
          title="Send message"
          disabled={!input.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
      <div className="input-footer">
        <span>🎙️ Voice input available • Press Enter to send</span>
      </div>
    </div>
  );
}