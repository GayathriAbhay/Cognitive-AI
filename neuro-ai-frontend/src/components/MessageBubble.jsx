// src/components/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message }) => {
  return (
    <div className={`bubble ${message.sender}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default MessageBubble; // THIS LINE IS LIKELY MISSING