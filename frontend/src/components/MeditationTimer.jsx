import { useState, useEffect } from 'react';
import api from '../utils/api';

const PLANS = [
  { id: 1, label: '1 Min: Quick Reset', duration: 60, icon: '⚡' },
  { id: 2, label: '3 Min: Pause & Breathe', duration: 180, icon: '🌬️' },
  { id: 3, label: '5 Min: Deep Calm', duration: 300, icon: '🌊' },
  { id: 4, label: '10 Min: Body Scan', duration: 600, icon: '🧘‍♀️' },
];

export default function MeditationTimer({ onComplete }) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [timeLeft, setTimeLeft] = useState(selectedPlan.duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTimeLeft(selectedPlan.duration);
    setIsActive(false);
  }, [selectedPlan]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = async () => {
    setIsActive(false);
    const mins = Math.ceil(selectedPlan.duration / 60);
    try {
      await api.put('/wellness/today', { meditationMinutes: mins });
      if (onComplete) onComplete(mins);
      // Play a soft bell sound via public URL
      const audio = new Audio('https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3'); 
      audio.play().catch(() => console.log('Audio autoplay blocked by browser'));
    } catch(e) {
      console.error(e);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedPlan.duration);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wellness-card meditation-card flex-col">
      <div className="meditation-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🧘 Meditation Timer</h3>
        {isActive && <span className="breathing-dot" title="Active">🔴</span>}
      </div>

      <div className="meditation-plans">
        {PLANS.map(p => (
          <button
            key={p.id}
            className={`plan-btn ${p.id === selectedPlan.id ? 'active' : ''}`}
            onClick={() => setSelectedPlan(p)}
            disabled={isActive}
          >
            <span className="plan-icon">{p.icon}</span> 
            <span className="plan-label">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="meditation-display">
        <div className={`meditation-circle ${isActive ? 'pulse-slow' : ''}`}>
          <span className="time-display">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="meditation-controls">
        <button className="btn-primary" onClick={toggleTimer} style={{ flex: 2 }}>
          {isActive ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn-secondary" onClick={resetTimer} disabled={isActive || timeLeft === selectedPlan.duration} style={{ flex: 1 }}>
          Reset
        </button>
      </div>
    </div>
  );
}
