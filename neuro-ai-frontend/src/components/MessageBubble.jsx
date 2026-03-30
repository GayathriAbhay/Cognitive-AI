import React, { useState, useEffect } from 'react';

// Render inline bold: **text** → <strong>
function renderInline(text) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

// Parse markdown text into structured blocks
function parseMarkdown(text) {
  const lines = text.split('\n').filter(l => l.trim() !== '');
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    // Numbered step: **Step N: ...**  or  **Step N.**
    const stepMatch = trimmed.match(/^\*\*Step\s+(\d+)[:.]\s*(.*?)\*\*(.*)$/i);
    if (stepMatch) {
      flushList();
      blocks.push({ type: 'step', num: stepMatch[1], title: stepMatch[2], rest: stepMatch[3].trim() });
      return;
    }

    // Bullet: * item or - item
    const bulletMatch = trimmed.match(/^[*\-]\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
      return;
    }

    flushList();
    if (trimmed) {
      blocks.push({ type: 'text', content: trimmed });
    }
  });

  flushList();
  return blocks;
}

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isArray = Array.isArray(message.text);
  const [isPlaying, setIsPlaying] = useState(false);

  // Clean up if component unmounts while playing
  useEffect(() => {
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop anything else playing
    
    // Clean text for natural speech
    let rawText = isArray ? message.text.join('. ') : (message.text || '');
    
    const cleanText = rawText
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images entirely
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Extract text from markdown links
      .replace(/[*#_`]/g, '') // Remove basic markdown including backticks
      .replace(/[\u201c\u201d\u2018\u2019"']/g, '') // Remove all types of quotes
      .replace(/,/g, '') // Remove commas
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') // Remove emojis
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';

    // Best "Human-like" FEMALE voices common in modern browsers
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Filter for names that are typically female or high-quality neural
      const isFemale = (v) => {
        const name = v.name.toLowerCase();
        const commonFemaleNames = ['aria', 'jenny', 'samantha', 'zira', 'hazel', 'susan', 'linda', 'heather', 'catherine'];
        return commonFemaleNames.some(f => name.includes(f)) || name.includes('female') || name.includes('natural');
      };

      const femaleVoices = voices.filter(v => v.lang.startsWith('en') && isFemale(v));
      
      // Specifically avoid voices that are explicitly male
      const finalOptions = femaleVoices.filter(v => !v.name.toLowerCase().includes('guy') && !v.name.toLowerCase().includes('male'));

      // Priority 1: Natural Neural (Best)
      let bestVoice = finalOptions.find(v => v.name.includes('Natural'));
      
      // Priority 2: Google/Aria/Jenny Standards
      if (!bestVoice) bestVoice = finalOptions.find(v => v.name.includes('Google US English'));
      if (!bestVoice) bestVoice = finalOptions[0]; // First available female voice
      
      // Generic fallback (only if no female voice found at all)
      if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith('en'));
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    // Slightly higher pitch and slightly slower rate for a friendly, natural pace
    utterance.pitch = 1.15; 
    utterance.rate = 0.88;
    utterance.volume = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isBot || isArray) {
    return (
      <div className={`bubble ${message.sender}`}>
        {isArray ? (
          <ul className="message-list-content">
            {message.text.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        ) : (
          <p>{message.text}</p>
        )}
      </div>
    );
  }

  const blocks = parseMarkdown(message.text || '');
  const hasSteps = blocks.some(b => b.type === 'step');

  return (
    <div className="bubble bot">
      {blocks.map((block, i) => {
        if (block.type === 'step') {
          return (
            <div key={i} className="md-step">
              <div className="md-step-badge">{block.num}</div>
              <div className="md-step-body">
                {block.title && <span className="md-step-title">{block.title}</span>}
                {block.rest && <span className="md-step-rest"> {renderInline(block.rest)}</span>}
              </div>
            </div>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="md-list">
              {block.items.map((item, j) => (
                <li key={j} className="md-list-item">
                  <span className="md-bullet">✦</span>
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="md-text">{renderInline(block.content)}</p>
        );
      })}

      <div className="bubble-actions">
        <button 
          onClick={handleSpeak} 
          className={`tts-btn ${isPlaying ? 'playing' : ''}`} 
          title="Read Aloud"
        >
          {isPlaying ? '⏹️ Stop Audio' : '🔊 Listen'}
        </button>
      </div>
    </div>
  );
};

export default MessageBubble;