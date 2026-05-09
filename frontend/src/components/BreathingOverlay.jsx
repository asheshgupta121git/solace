import { useState, useEffect, useRef } from 'react';

// 4-7-8 breathing pattern: inhale 4s, hold 7s, exhale 8s
const PHASES = [
  { label: 'Inhale',    instruction: 'Breathe in slowly through your nose…', duration: 4 },
  { label: 'Hold',      instruction: 'Hold gently and let your body settle…', duration: 7 },
  { label: 'Exhale',    instruction: 'Release slowly through your mouth…',   duration: 8 },
];

export default function BreathingOverlay({ onClose }) {
  const [phaseIdx,  setPhaseIdx]  = useState(0);
  const [elapsed,   setElapsed]   = useState(0);   // seconds in current phase
  const [cycle,     setCycle]     = useState(1);
  const [active,    setActive]    = useState(true);
  const intervalRef = useRef(null);

  const phase = PHASES[phaseIdx];
  const progress = Math.min((elapsed / phase.duration) * 100, 100);

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= phase.duration) {
          // Advance to next phase
          setPhaseIdx(pi => {
            const next = (pi + 1) % PHASES.length;
            if (next === 0) setCycle(c => c + 1);
            return next;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active, phaseIdx, phase.duration]);

  const toggle = () => setActive(a => !a);

  const phaseColors = {
    'Inhale':  'var(--purple-light)',
    'Hold':    'var(--teal)',
    'Exhale':  '#a5b4fc',
  };

  return (
    <div
      className="breathing-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Breathing exercise"
    >
      {/* Animated breathing circle */}
      <div className="breathing-circle-wrap" aria-hidden="true">
        <div className="breathing-ring" />
        <div className="breathing-ring" />
        <div
          className="breathing-circle"
          style={{
            animationPlayState: active ? 'running' : 'paused',
            animationDuration: `${phase.duration * 2}s`,
          }}
        >
          🕊️
        </div>
      </div>

      {/* Phase label */}
      <div className="breathing-text">
        <div
          className="breathing-phase"
          style={{ color: phaseColors[phase.label] }}
          aria-live="polite"
        >
          {phase.label}
        </div>
        <div className="breathing-instruction">{phase.instruction}</div>
        <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {elapsed + 1}s / {phase.duration}s &nbsp;·&nbsp; Cycle {cycle}
        </div>
      </div>

      {/* Progress bar */}
      <div className="breathing-progress" aria-hidden="true">
        <div
          className="breathing-progress-bar"
          style={{ width: `${progress}%`, background: phaseColors[phase.label] }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          id="btn-breathing-toggle"
          className="breathing-close"
          onClick={toggle}
          aria-label={active ? 'Pause breathing exercise' : 'Resume breathing exercise'}
        >
          {active ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button
          id="btn-breathing-close"
          className="breathing-close"
          onClick={onClose}
          aria-label="Close breathing exercise"
        >
          ✕ Close
        </button>
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 300 }}>
        4-7-8 breathing technique · Reduces anxiety and promotes calm
      </p>
    </div>
  );
}
