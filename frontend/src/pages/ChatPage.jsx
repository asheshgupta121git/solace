import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import MoodModal from '../components/MoodModal';
import BreathingOverlay from '../components/BreathingOverlay';

export default function ChatPage() {
  const { user } = useAuth();
  const chat = useChat();

  const [showMoodModal, setShowMoodModal]         = useState(false);
  const [showBreathing, setShowBreathing]         = useState(false);
  const [pendingNewChat, setPendingNewChat]       = useState(false);

  // Open mood modal before starting new chat
  const handleNewChat = () => {
    setPendingNewChat(true);
    setShowMoodModal(true);
  };

  // Called when user confirms mood/topic in modal
  const handleMoodConfirm = ({ mood, topic }) => {
    setShowMoodModal(false);
    if (pendingNewChat) {
      chat.startNewSession(topic, mood);
      setPendingNewChat(false);
    } else {
      chat.setMood(mood);
      chat.setTopic(topic);
    }
  };

  const handleSessionSelect = (id) => {
    chat.loadSession(id);
  };

  return (
    <div className="app-layout">
      <div className="aurora-bg" aria-hidden="true" />

      <Sidebar
        activeSessionId={chat.sessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSessionSelect}
        onBreathing={() => setShowBreathing(true)}
        onMoodCheck={() => { setPendingNewChat(false); setShowMoodModal(true); }}
      />

      <main className="chat-area">
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
          isCrisis={chat.isCrisis}
          topic={chat.topic}
          mood={chat.mood}
          error={chat.error}
          onSend={chat.sendMessage}
          onNewChat={handleNewChat}
          user={user}
        />
      </main>

      {showMoodModal && (
        <MoodModal
          initialMood={chat.mood}
          initialTopic={chat.topic}
          onConfirm={handleMoodConfirm}
          onClose={() => { setShowMoodModal(false); setPendingNewChat(false); }}
        />
      )}

      {showBreathing && (
        <BreathingOverlay onClose={() => setShowBreathing(false)} />
      )}
    </div>
  );
}
