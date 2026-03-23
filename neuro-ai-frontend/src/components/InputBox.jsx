import { useState } from "react";

export default function InputBox({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const startVoice = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  };

  return (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-blue-400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask your question..."
        aria-label="Type your question"
      />

      <button onClick={startVoice} className="px-3 bg-gray-200 rounded-xl">
        🎤
      </button>

      <button
        onClick={handleSend}
        className="px-4 bg-blue-500 text-white rounded-xl"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}