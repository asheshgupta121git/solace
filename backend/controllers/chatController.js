const { GoogleGenerativeAI } = require('@google/generative-ai');
const Session = require('../models/Session');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are Solace, a compassionate AI mental health support companion (NOT a licensed therapist or doctor).

Your purpose: Provide warm emotional support and active listening for:
- Youth depression
- Workplace stress
- Loneliness and social isolation
- Academic pressure
- Mild trauma-related stress (not PTSD treatment)

STRICT RULES:
- NEVER provide medical advice or diagnosis
- NEVER prescribe or recommend medication
- NEVER claim to be a therapist or professional
- NEVER validate harmful or dangerous actions
- Always encourage healthy coping mechanisms
- Keep responses between 4-7 lines max
- Be warm, human, NOT robotic

RESPONSE STRUCTURE:
1. Acknowledge feelings with empathy ("That sounds really hard…")
2. Validate ("It's completely understandable to feel this way…")
3. Offer 1-2 gentle coping suggestions (breathing, journaling, short walks, talking to someone)
4. End with ONE soft open-ended follow-up question

CRISIS DETECTION:
If user expresses suicidal thoughts, self-harm, extreme hopelessness, or phrases like "I want to die", "can't go on", "end everything":
- Respond with deep empathy and care
- Gently but clearly encourage contacting crisis helplines
- Use [CRISIS] tag at start of response if crisis detected
- Do NOT use normal coping suggestions in crisis mode

TONE: Warm, calm, empathetic, human. Like a caring friend who truly listens. Never clinical or robotic.`;

// POST /api/chat/message
const sendMessage = async (req, res) => {
  try {
    const { sessionId, message, topic, mood } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Load or create session
    let session;
    if (sessionId) {
      session = await Session.findOne({ _id: sessionId, user: req.user._id });
      if (!session) return res.status(404).json({ error: 'Session not found.' });
    } else {
      session = await Session.create({
        user: req.user._id,
        topic: topic || 'general',
        mood: mood || null,
        messages: [],
      });
    }

    // Update mood/topic if provided
    if (mood) session.mood = mood;
    if (topic) session.topic = topic;

    // Add user message to history
    session.messages.push({ role: 'user', content: message });

    // Build messages array for Gemini (max last 20 for context window)
    // Gemini roles: 'user' | 'model'
    const historyForGemini = session.messages.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Build system string with context
    const systemWithContext =
      SYSTEM_PROMPT +
      (mood ? `\n\nUser's current mood: ${mood}` : '') +
      (topic ? `\n\nConversation topic: ${topic}` : '');

    // Configure the specific model and pass system instructions
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemWithContext
    });

    // Call Google Gemini API
    const response = await model.generateContent({
      contents: historyForGemini
    });
    
    const aiText = response.response.text() || "I'm here with you. Could you share a little more?";
    const isCrisis = aiText.startsWith('[CRISIS]');
    const cleanText = aiText.replace('[CRISIS]', '').trim();

    // Save assistant reply to session
    session.messages.push({ role: 'assistant', content: cleanText });

    // Auto-generate title from first user message
    if (session.messages.filter(m => m.role === 'user').length === 1) {
      session.generateTitle();
    }

    await session.save();

    res.json({
      sessionId: session._id,
      message: cleanText,
      isCrisis,
    });
  } catch (err) {
    console.error('Chat error:', err?.message || err);
    let errorDetail = err?.message || 'Failed to get AI response. Please try again.';
    
    // Nice error for Gemini missing API key
    if (errorDetail.includes('API key')) {
      errorDetail = 'Missing or invalid Google Gemini API key. Please check your .env file.';
    }

    res.status(500).json({ error: errorDetail });
  }
};

module.exports = { sendMessage };