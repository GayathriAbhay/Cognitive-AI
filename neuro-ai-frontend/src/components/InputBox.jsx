import React, { useState } from "react";

// This component receives props from ChatInterface.jsx to handle messages and voice
export default function InputBox({ sendMessage, listening, startListening, stopListening }) {
  const [input, setInput] = useState("");

  // Logic to handle the "Send" action
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input); // Passes the text back to the main ChatInterface
    setInput("");       // Clears the box for the next message
  };

  // Helper for voice: if you aren't using the library's transcript sync, 
  // this local function handles the browser's native Speech API
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser does not support Speech Recognition");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  return (
    <div className="flex gap-2 mt-3 p-4 border-t bg-white">
      {/* Search/Input Field */}
      <input
        className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask your question..."
        aria-label="Type your question"
      />

      {/* Voice Toggle Button */}
      <button 
        type="button"
        onClick={listening ? stopListening : (startListening || startVoice)} 
        className={`px-4 rounded-xl transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200'}`}
        aria-label={listening ? "Stop listening" : "Start voice input"}
      >
        {listening ? '🛑' : '🎤'}
      </button>

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        className="px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all font-medium"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}