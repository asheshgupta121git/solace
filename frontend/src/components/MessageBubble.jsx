const TOPIC_LABELS = {
  depression: 'Feeling down',
  stress: 'Stress & burnout',
  loneliness: 'Loneliness',
  academic: 'Academic pressure',
  trauma: 'Trauma & healing',
  general: 'General support',
};

const MOOD_EMOJI = {
  'very sad': '😢',
  'sad': '😔',
  'anxious': '😰',
  'neutral': '😐',
  'okay': '🙂',
  'happy': '😊',
};

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ role, content, timestamp, isCrisis }) {
  const isUser = role === 'user';

  return (
    <div
      className={`message-row ${role}${isCrisis ? ' crisis' : ''}`}
      aria-label={`${isUser ? 'You' : 'Solace'}: ${content}`}
    >
      {/* Avatar */}
      <div className="message-avatar" aria-hidden="true">
        {isUser ? '👤' : '🕊️'}
      </div>

      {/* Bubble */}
      <div className="message-bubble">
        {isCrisis && (
          <div className="crisis-badge" role="alert">
            🆘 Crisis support mode
          </div>
        )}
        <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
        {isCrisis && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.6rem 0.875rem',
            background: 'rgba(244,114,182,0.15)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: '#f9a8d4',
          }}>
            <strong>📞 Crisis helplines:</strong><br />
            iCall (India): <strong>9152987821</strong><br />
            Vandrevala Foundation: <strong>1860-2662-345</strong><br />
            International: <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#f472b6' }}
            >findahelpline.com</a>
          </div>
        )}
        <time className="msg-time" dateTime={timestamp}>{formatTime(timestamp)}</time>
      </div>
    </div>
  );
}
