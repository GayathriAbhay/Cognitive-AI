import React, { useState, useEffect, useRef, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

const ChatInterface = (props) => {
  const { setDebugData, chatSendRef, onNewChat } = props;
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hello! I'm CogniLearn. How can I help you simplify your learning today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const messagesRef = useRef(messages);

  // Keep messagesRef in sync so quick-action callbacks always see latest history
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Sync Voice Transcript to Input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Auto-scroll for new messages
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.parentElement) {
      scrollRef.current.parentElement.scrollTop = scrollRef.current.parentElement.scrollHeight;
    }
  }, [messages]);


  const sendMessage = useCallback(async (msgText) => {
    const textToSubmit = msgText || input;
    if (!textToSubmit.trim()) return;

    // Build conversation history for backend context (last 10 messages)
    const history = messagesRef.current.slice(-10).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSubmit }]);
    setInput('');
    resetTranscript();

    const startTime = Date.now();
    const payload = { text: textToSubmit, history };

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
          profile: 'default'
        });
      }

      const botResponse = data.simplified || data.personalized;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse
        }
      ]);

      // Inform App that a new interaction happened so progress report can reload
      if (props.onNewChat) {
        props.onNewChat();
      }
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
  }, [input, resetTranscript, props]);

  // Expose sendMessage to parent AFTER it is defined
  useEffect(() => {
    if (props.chatSendRef) {
      props.chatSendRef.current = sendMessage;
    }
  }, [sendMessage, props.chatSendRef]);

  const handleFileUpload = async (file) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `📄 Uploaded document: ${file.name}` }
    ]);

    const loadingId = Date.now() + 1;
    setMessages(prev => [
      ...prev,
      { id: loadingId, sender: 'bot', text: `Reading and analyzing ${file.name}... ⏳` }
    ]);

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:5000/ai/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { ...msg, text: data.simplified || data.error || data.msg || `Unknown response: ${JSON.stringify(data)}` } 
          : msg
      ));

      if (props.onNewChat) {
        props.onNewChat();
      }
    } catch (error) {
      console.error("File upload error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { ...msg, text: "I hit an error trying to process that file. Please try again!" } 
          : msg
      ));
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="error">Voice recognition is not supported in this browser.</div>;
  }

  return (
    <div className="chat-container">
      {/* Message History */}
      <div className="messages-window" aria-live="polite">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Modern Pill Input */}
      <InputBox
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        listening={listening}
        startListening={() => SpeechRecognition.startListening({ continuous: true })}
        stopListening={SpeechRecognition.stopListening}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default ChatInterface;
 ChatInterface;