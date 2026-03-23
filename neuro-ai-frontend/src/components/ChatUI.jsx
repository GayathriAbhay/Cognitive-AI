import { useState } from "react";
import MessageBubble from "./MessageBubble";
import InputBox from "./InputBox";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI learning assistant 😊", sender: "bot" }
  ]);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Let me simplify that for you...", sender: "bot" }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-2xl shadow p-4">
      
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
      </div>

      <InputBox onSend={sendMessage} />
    </div>
  );
}