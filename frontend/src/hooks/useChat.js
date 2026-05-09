import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useChat() {
  const [messages, setMessages]     = useState([]);
  const [sessionId, setSessionId]   = useState(null);
  const [topic, setTopic]           = useState('general');
  const [mood, setMood]             = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [isCrisis, setIsCrisis]     = useState(false);
  const [error, setError]           = useState(null);

  // Load an existing session from the server
  const loadSession = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/sessions/${id}`);
      const session = res.data;
      setSessionId(session._id);
      setTopic(session.topic || 'general');
      setMood(session.mood || null);
      setMessages(
        session.messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          isCrisis: false,
        }))
      );
    } catch (err) {
      setError('Failed to load session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a brand-new conversation
  const startNewSession = useCallback((newTopic = 'general', newMood = null) => {
    setSessionId(null);
    setMessages([]);
    setTopic(newTopic);
    setMood(newMood);
    setIsCrisis(false);
    setError(null);
  }, []);

  // Send a message to Claude via the backend
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.post('/chat/message', {
        sessionId,
        message: text.trim(),
        topic,
        mood,
      });

      const { sessionId: newId, message: aiText, isCrisis: crisis } = res.data;

      // Save new sessionId if this was first message
      if (!sessionId) setSessionId(newId);
      if (crisis) setIsCrisis(true);

      const assistantMessage = {
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString(),
        isCrisis: crisis,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, topic, mood, isLoading]);

  return {
    messages,
    sessionId,
    topic,
    mood,
    isLoading,
    isCrisis,
    error,
    setTopic,
    setMood,
    sendMessage,
    loadSession,
    startNewSession,
  };
}
