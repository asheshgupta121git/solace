import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TOPIC_ICONS = {
  depression: '🌧️',
  stress: '😤',
  loneliness: '🤝',
  academic: '📚',
  trauma: '💙',
  general: '💬',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Sidebar({
  activeSessionId,
  onNewChat,
  onSelectSession,
  onBreathing,
  onMoodCheck,
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessions, setSessions]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const isWellness = location.pathname.includes('/wellness');

  // Fetch sessions list
  useEffect(() => {
    let cancelled = false;
    api.get('/sessions')
      .then(res => { if (!cancelled) setSessions(res.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey, activeSessionId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch {}
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="sidebar" aria-label="Sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-emoji">🕊️</span>
          <h2>Solace</h2>
        </div>
        
        <div className="sidebar-nav-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            className={`btn-tool ${!isWellness ? 'active' : ''}`}
            onClick={() => navigate('/chat')}
            style={{ flex: 1, padding: '0.6rem' }}
          >
            💬 Chat
          </button>
          <button 
            className={`btn-tool ${isWellness ? 'active' : ''}`}
            onClick={() => navigate('/wellness')}
            style={{ flex: 1, padding: '0.6rem' }}
          >
            🌱 Wellness
          </button>
        </div>

        {!isWellness && (
          <button id="btn-new-chat" className="btn-new-chat" onClick={onNewChat}>
            <span>✦</span> New Conversation
          </button>
        )}
      </div>

      {/* Quick tools */}
      <div className="sidebar-actions">
        <button id="btn-breathing" className="btn-tool" onClick={onBreathing} title="Breathing exercise">
          <span>🌬️</span> Breathe
        </button>
        <button id="btn-mood-check" className="btn-tool" onClick={onMoodCheck} title="Check your mood">
          <span>🎭</span> Mood
        </button>
        <button id="btn-refresh-sessions" className="btn-tool" onClick={() => setRefreshKey(k => k + 1)} title="Refresh">
          <span>↻</span>
        </button>
      </div>

      {/* Content depending on tab */}
      {!isWellness ? (
        <nav className="sidebar-sessions" aria-label="Conversation history">
          <div className="sidebar-sessions-label">Recent Conversations</div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
            </div>
          ) : sessions.length === 0 ? (
            <div className="sessions-empty">
              <span className="empty-icon">🌿</span>
              No conversations yet.<br />Start one above!
            </div>
          ) : (
            sessions.map(s => (
              <div
                key={s._id}
                className={`session-item${s._id === activeSessionId ? ' active' : ''}`}
                onClick={() => onSelectSession(s._id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelectSession(s._id)}
                aria-label={`Open conversation: ${s.title}`}
              >
                <span className="session-icon">{TOPIC_ICONS[s.topic] || '💬'}</span>
                <div className="session-info">
                  <div className="session-title">{s.title || 'New Conversation'}</div>
                  <div className="session-meta">{timeAgo(s.updatedAt)}</div>
                </div>
                <button
                  className="btn-delete"
                  onClick={e => handleDelete(e, s._id)}
                  title="Delete"
                  aria-label={`Delete: ${s.title}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </nav>
      ) : (
        <div className="sidebar-sessions" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✨</span>
          <p>Track your daily water, steps, and self-care tasks here.</p>
          <p style={{ marginTop: '0.5rem' }}>Building tiny habits creates massive change over time.</p>
        </div>
      )}

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar" aria-hidden="true">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-label">Safe space 💜</div>
          </div>
          <button
            id="btn-logout"
            className="btn-logout"
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}
