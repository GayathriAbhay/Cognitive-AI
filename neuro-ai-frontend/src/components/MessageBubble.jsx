const MessageBubble = ({ message }) => {
  const isArray = Array.isArray(message.text);
  
  return (
    <div className={`bubble ${message.sender}`}>
      {isArray ? (
        <ul className="message-list-content">
          {message.text.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{message.text}</p>
      )}
    </div>
  );
};

export default MessageBubble; // THIS LINE IS LIKELY MISSING