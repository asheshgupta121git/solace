import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MeditationTimer from '../components/MeditationTimer';
import api from '../utils/api';
import '../styles/global.css';

export default function WellnessPage() {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Local state for immediate UI feedback on steps
  const [stepInput, setStepInput] = useState('');

  const fetchWellness = async () => {
    try {
      const res = await api.get('/wellness/today');
      setWellnessData(res.data);
    } catch (err) {
      console.error('Failed to load wellness data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellness();
  }, []);

  const updateServer = async (payload) => {
    try {
      const res = await api.put('/wellness/today', payload);
      setWellnessData(res.data);
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  const handleWaterClick = (index) => {
    // If they click glass 3 and they currently have 2, set logic to 3
    // Easiest UI: click setting water equal to index + 1
    const newWater = index + 1 === wellnessData.water ? index : index + 1; 
    setWellnessData(prev => ({ ...prev, water: newWater }));
    updateServer({ water: newWater });
  };

  const handleTaskToggle = (taskId, completed) => {
    // Optimistic UI update
    setWellnessData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed } : t)
    }));
    updateServer({ taskId, taskCompleted: completed });
  };

  const handleAddSteps = (e) => {
    e.preventDefault();
    const added = parseInt(stepInput, 10);
    if (isNaN(added) || added <= 0) return;
    
    const newSteps = wellnessData.steps + added;
    setWellnessData(prev => ({ ...prev, steps: newSteps }));
    updateServer({ steps: newSteps });
    setStepInput('');
  };

  const TIPS = [
    "Tip: Let thoughts pass like clouds in the sky, do not hold onto them.",
    "Tip: Focus on the physical sensation of breath entering and leaving your nostrils.",
    "Tip: It is normal for the mind to wander. Just gently gently guide it back.",
    "Tip: Relax your jaw and drop your shoulders away from your ears.",
    "Tip: Meditation is not about emptying the mind, but observing it unconditionally."
  ];
  // Stable random tip based on today's date
  const tipIndex = new Date().getDate() % TIPS.length;

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="spinner" />
        </main>
      </div>
    );
  }

  if (!wellnessData) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content wellness-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <h3>Failed to load Wellness Dashboard</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Make sure your backend server is running on port 5000.</p>
            <button className="btn-primary" onClick={fetchWellness} style={{ marginTop: '1rem' }}>Retry</button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate stats
  const stepsGoal = 10000;
  const stepsPercent = Math.min(100, Math.round((wellnessData.steps / stepsGoal) * 100));
  const waterGoal = 8;
  const tasksCompleted = wellnessData.tasks.filter(t => t.completed).length;
  const tasksTotal = wellnessData.tasks.length;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content wellness-main">
        <header className="wellness-header">
          <h1>Today's Wellness ✨</h1>
          <p>Small habits lead to big positive changes in your mental health.</p>
          <div className="wellness-tip-banner">
            <span className="tip-icon">💡</span> {TIPS[tipIndex]}
          </div>
        </header>

        <div className="wellness-grid">
          {/* Meditation Timer Component */}
          <MeditationTimer onComplete={(mins) => setWellnessData(prev => ({ ...prev, meditationMinutes: (prev.meditationMinutes || 0) + mins }))} />

          {/* Water Tracker */}
          <div className="wellness-card water-card flex-col">
            <h3>💧 Hydration</h3>
            <p className="card-subtitle">{wellnessData.water} / {waterGoal} Glasses</p>
            <div className="water-glasses">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <button 
                  key={i} 
                  className={`water-glass ${i < wellnessData.water ? 'filled' : ''}`}
                  onClick={() => handleWaterClick(i)}
                  title={`Glass ${i + 1}`}
                >
                  {i < wellnessData.water ? '💧' : '🫗'}
                </button>
              ))}
            </div>
          </div>

          {/* Step Counter */}
          <div className="wellness-card step-card flex-col">
            <h3>🚶 Movement & Stats</h3>
            <p className="card-subtitle">{wellnessData.steps.toLocaleString()} / {stepsGoal.toLocaleString()} Steps</p>
            
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${stepsPercent}%` }} />
            </div>
            
            <form onSubmit={handleAddSteps} className="steps-form" style={{ marginBottom: '1rem' }}>
              <input 
                type="number" 
                placeholder="Add steps (+)" 
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                min="1"
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 1rem' }}>Add</button>
            </form>

            <div className="stats-box">
              <span className="stats-icon">⏳</span>
              <span>Total Meditation: <strong>{wellnessData.meditationMinutes || 0} mins</strong> today</span>
            </div>
          </div>

          {/* Self-Care Tasks */}
          <div className="wellness-card tasks-card flex-col">
            <h3>🌱 Daily Self-Care</h3>
            <p className="card-subtitle">{tasksCompleted} / {tasksTotal} Completed</p>
            
            <ul className="task-list" style={{ marginTop: '0.5rem', flex: 1, overflowY: 'auto' }}>
              {wellnessData.tasks.map(task => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label className="task-label">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={(e) => handleTaskToggle(task.id, e.target.checked)}
                    />
                    <span className="task-text">{task.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
