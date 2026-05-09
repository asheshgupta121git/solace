import { useState } from 'react';

const MOODS = [
  { value: 'very sad',  emoji: '😢', label: 'Very Sad' },
  { value: 'sad',       emoji: '😔', label: 'Sad' },
  { value: 'anxious',   emoji: '😰', label: 'Anxious' },
  { value: 'neutral',   emoji: '😐', label: 'Neutral' },
  { value: 'okay',      emoji: '🙂', label: 'Okay' },
  { value: 'happy',     emoji: '😊', label: 'Happy' },
];

const TOPICS = [
  { value: 'general',    label: '💬 General support' },
  { value: 'depression', label: '🌧️ Feeling low / Depression' },
  { value: 'stress',     label: '😤 Stress & Burnout' },
  { value: 'loneliness', label: '🤝 Loneliness' },
  { value: 'academic',   label: '📚 Academic Pressure' },
  { value: 'trauma',     label: '💙 Trauma & Healing' },
];

export default function MoodModal({ initialMood, initialTopic, onConfirm, onClose }) {
  const [selectedMood,  setSelectedMood]  = useState(initialMood || null);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || 'general');

  const handleConfirm = () => {
    onConfirm({ mood: selectedMood, topic: selectedTopic });
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mood-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        <h2 id="mood-modal-title">How are you feeling?</h2>
        <p>Help me support you better by sharing your current mood and what you'd like to talk about.</p>

        {/* Mood grid */}
        <div className="mood-grid" role="group" aria-label="Select your mood">
          {MOODS.map((m) => (
            <button
              key={m.value}
              id={`mood-${m.value.replace(' ', '-')}`}
              className={`mood-option${selectedMood === m.value ? ' selected' : ''}`}
              onClick={() => setSelectedMood(m.value)}
              aria-pressed={selectedMood === m.value}
              aria-label={m.label}
            >
              <span className="mood-emoji" aria-hidden="true">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Topic select */}
        <div className="topic-select">
          <label htmlFor="topic-select">What would you like to talk about?</label>
          <select
            id="topic-select"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button
            id="btn-modal-skip"
            className="btn-secondary"
            onClick={() => onConfirm({ mood: null, topic: 'general' })}
          >
            Skip
          </button>
          <button
            id="btn-modal-confirm"
            className="btn-primary"
            onClick={handleConfirm}
            style={{ margin: 0 }}
          >
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
