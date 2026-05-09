import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';

const TOPIC_LABELS = {
  depression: '🌧️ Feeling down',
  stress: '😤 Stress & burnout',
  loneliness: '🤝 Loneliness',
  academic: '📚 Academic pressure',
  trauma: '💙 Trauma & healing',
  general: '💬 General support',
};

const WELCOME_CARDS = [
  { icon: '🌧️', title: 'Feeling Low', desc: 'Talk about what\'s weighing on you', topic: 'depression' },
  { icon: '😤', title: 'Stressed Out', desc: 'Work, life or deadline pressure', topic: 'stress' },
  { icon: '🤝', title: 'Feeling Alone', desc: 'When loneliness feels overwhelming', topic: 'loneliness' },
  { icon: '📚', title: 'Academic Stress', desc: 'Exams, grades or performance anxiety', topic: 'academic' },
];

export default function ChatWindow({
  messages,
  isLoading,
  isCrisis,
  topic,
  mood,
  error,
  onSend,
  onNewChat,
  user,
}) {
  const [input, setInput]     = useState('');
  const bottomRef             = useRef(null);
  const textareaRef           = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-grow textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCardClick = (cardTopic) => {
    onNewChat();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-window">
      {/* Top bar — only show when there are messages */}
      {!isEmpty && (
        <div className="chat-topbar">
          <span className="topic-badge">
            {TOPIC_LABELS[topic] || '💬 General support'}
          </span>
          {mood && (
            <span className="mood-badge">
              {mood}
            </span>
          )}
          <div className="spacer" />
          {isCrisis && (
            <span style={{
              fontSize: '0.75rem',
              color: '#f472b6',
              background: 'rgba(244,114,182,0.12)',
              border: '1px solid rgba(244,114,182,0.3)',
              borderRadius: '100px',
              padding: '0.25rem 0.75rem',
            }}>
              🆘 Crisis Mode Active
            </span>
          )}
        </div>
      )}

      {/* Messages OR Welcome screen */}
      <div className="messages-container">
        {isEmpty ? (
          <div className="chat-welcome">
            <div className="welcome-hero">
              <span className="hero-icon">🕊️</span>
              <h1>Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
              <p>
                I'm Solace, your compassionate companion. This is a safe, judgment-free space
                to share what's on your mind. How are you feeling today?
              </p>
            </div>
            <div className="welcome-cards">
              {WELCOME_CARDS.map((c) => (
                <button
                  key={c.topic}
                  className="welcome-card"
                  onClick={() => handleCardClick(c.topic)}
                  aria-label={`Start conversation about: ${c.title}`}
                >
                  <div className="card-icon">{c.icon}</div>
                  <div className="card-title">{c.title}</div>
                  <div className="card-desc">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                isCrisis={msg.isCrisis}
              />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="message-row assistant" aria-live="polite" aria-label="Solace is typing">
                <div className="message-avatar" aria-hidden="true">🕊️</div>
                <div className="message-bubble">
                  <div className="typing-indicator" aria-hidden="true">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div
                className="error-msg"
                role="alert"
                style={{ margin: '0 auto', maxWidth: 480, textAlign: 'center' }}
              >
                ⚠️ {error}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            id="chat-input"
            placeholder={
              isEmpty
                ? 'Type how you\'re feeling… I\'m here to listen 💜'
                : 'Share what\'s on your mind…'
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            id="btn-send-message"
            className="btn-send"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            ↑
          </button>
        </div>
        <p className="input-hint">
          Press <kbd style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>Enter</kbd> to send &nbsp;·&nbsp;
          <kbd style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
