# Solace 🌿
**Your Compassionate AI Mental Health Companion**

A full-stack mental health support application built with modern AI technologies, designed to provide a safe, judgment-free space for users to share their thoughts, practice mindfulness, and track their wellness journey.

---

## 🌟 Features

- **AI-Powered Chat Support** - Real-time conversations with compassionate AI companions using advanced language models
- **Guided Meditation & Breathing Exercises** - Structured wellness activities with visual feedback and progress tracking
- **Mood Tracking** - Log daily moods and track emotional patterns over time
- **Wellness Dashboard** - Personalized insights into your mental health metrics (hydration, movement, meditation stats)
- **Session History** - Access past conversations and reflection notes
- **Secure Authentication** - OAuth 2.0 integration with Google for secure user login
- **Responsive Design** - Beautiful glassmorphism UI that works seamlessly across all devices

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** 
  - JWT (JSON Web Tokens) for session management
  - bcryptjs for password hashing
  - Passport.js with Google OAuth 2.0
  - express-session for session handling
- **AI Integration:**
  - Claude (Anthropic SDK) for empathetic responses
  - Google Generative AI for adaptive support
- **Security:** express-rate-limit for API protection
- **Other:** CORS support, dotenv for environment management

### Frontend
- **Framework:** React 18.3 with Vite build tool
- **Routing:** React Router DOM for seamless navigation
- **Styling:** Custom CSS with Glassmorphism design patterns
- **HTTP Client:** Axios for API communication
- **Features:** Component-based architecture with React hooks

---

## 🤖 AI Tools & Services Used

| Purpose | Tool | Usage |
|---------|------|-------|
| **Research & Market Analysis** | Perplexity AI, GenI Tools | User research, competitive analysis, mental health trends |
| **Backend Development** | Claude (Anthropic) | Core server logic, API architecture, authentication system |
| **AI Conversational Support** | Claude & Google Gemini | Empathetic responses, crisis support routing, wellness suggestions |
| **Frontend Development** | Google Gemini, Gemini Pro | Component design, UI/UX optimization, React patterns |
| **Theme & UI Design** | Gemini, Perplexity | Glassmorphism design system, color psychology, accessibility |
| **User Research & Insights** | Perplexity | Mental health content curation, theme validation |

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Google OAuth 2.0 credentials
- API keys for:
  - Anthropic Claude API
  - Google Generative AI

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd solace
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/solace
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
NODE_ENV=development
PORT=5000
```

Start the backend server:
```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Access the application at: `http://localhost:5173`

---

## 📁 Project Structure

```
solace/
├── backend/
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── sessionsController.js
│   │   └── wellnessController.js
│   ├── models/               # Database schemas
│   │   ├── User.js
│   │   ├── Session.js
│   │   └── Wellness.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── sessions.js
│   │   └── wellness.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── server.js             # Express app setup
│   ├── package.json
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── BreathingOverlay.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MeditationTimer.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MoodModal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── ChatPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── WellnessPage.jsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useChat.js
│   │   ├── utils/            # Utility functions
│   │   │   └── api.js
│   │   ├── styles/           # Global styles
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env                  # Environment variables
│
└── README.md
```

---

## 🔐 Authentication Flow

1. **Google OAuth 2.0** - Users sign in via Google
2. **Passport.js** - Authenticates Google credentials
3. **JWT Tokens** - Issues secure tokens for subsequent API calls
4. **Session Management** - express-session maintains user sessions
5. **Protected Routes** - Middleware verifies authentication on protected endpoints

---

## 💬 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth callback
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user (protected)

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history (protected)

### Sessions
- `GET /api/sessions` - List user sessions (protected)
- `DELETE /api/sessions/:id` - Delete a session (protected)

### Wellness
- `GET /api/wellness/stats` - Get wellness statistics (protected)
- `POST /api/wellness/mood` - Log mood entry (protected)
- `GET /api/wellness/progress` - Get wellness progress (protected)

---

## 🎨 Design Principles

- **Glassmorphism** - Modern translucent UI with backdrop blur effects
- **Accessibility** - WCAG compliant color contrasts and keyboard navigation
- **Responsive Design** - Mobile-first approach that scales beautifully
- **Calm Aesthetics** - Serene blue, sage green, and lavender color palette
- **Smooth Interactions** - Thoughtful animations and transitions

---

## 🧠 AI Integration Details

### Claude (Anthropic)
- Provides empathetic, nuanced responses to user concerns
- Handles crisis detection and appropriate referrals
- Supports context-aware conversation continuity

### Google Gemini
- Powers adaptive wellness suggestions
- Generates personalized meditation scripts
- Analyzes mood patterns and provides insights
- Supports multi-modal interactions (text, images)

---

## 📊 Performance Considerations

- Rate limiting on sensitive endpoints
- Connection pooling for database queries
- Frontend code splitting with Vite
- Lazy loading of components
- Optimized CSS with glassmorphism effects

---

## 🔒 Security Features

- Environment variable protection
- JWT token expiration
- Password hashing with bcryptjs
- CORS configuration
- Session timeout mechanisms
- Protected API routes with authentication middleware
- XSS and CSRF protection

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Environment Variables Reference

### Backend (.env)
```
MONGO_URI              # MongoDB connection string
JWT_SECRET             # JWT signing secret
JWT_EXPIRE             # JWT token expiration time
GOOGLE_CLIENT_ID       # Google OAuth client ID
GOOGLE_CLIENT_SECRET   # Google OAuth client secret
ANTHROPIC_API_KEY      # Claude API key
GOOGLE_GENERATIVE_AI_KEY  # Gemini API key
SESSION_SECRET         # Express session secret
NODE_ENV               # Environment (development/production)
PORT                   # Server port (default: 5000)
```

### Frontend (.env)
```
VITE_API_URL           # Backend API base URL
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Verify connection string in .env
- Check network connectivity

### Google OAuth Not Working
- Verify credentials in Google Cloud Console
- Check redirect URIs match your application
- Ensure API keys are correctly set in .env

### Frontend Not Loading
- Clear browser cache
- Restart Vite dev server
- Verify VITE_API_URL is correctly set

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Claude API Reference](https://docs.anthropic.com)
- [Google Gemini API](https://ai.google.dev)
- [Vite Documentation](https://vitejs.dev)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💖 Acknowledgments

- Built with ❤️ for mental health support
- Powered by cutting-edge AI technologies
- Designed with accessibility and empathy in mind
- Thanks to the open-source community

---

## 📞 Support

For support, questions, or feedback:
- Open an issue on GitHub
- Check existing documentation
- Review the contributing guidelines

---

**Solace: Because your mental health matters** 🌱
