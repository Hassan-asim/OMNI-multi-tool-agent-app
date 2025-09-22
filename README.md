# 🌐 Omni - Universal Life Connector

**The Ultimate AI-Powered Personal Assistant That Eliminates Digital Fragmentation**

Omni is a revolutionary universal personal assistant that connects all your digital services into one intelligent, unified experience. Built with LangChain, React, Material-UI, and Firebase, it transforms your chaotic digital life into organized harmony.

## ✨ Key Features

### 🎯 Universal Task Management
- Sync tasks from Todoist, Google Tasks, Asana, and more
- Intelligent prioritization based on context and energy levels
- Cross-platform task creation and management

### 💬 Communication Centralization
- Manage Gmail, Slack, WhatsApp, and SMS from one interface
- Smart message routing and response suggestions
- Unified communication dashboard

### 📱 Social Media Management
- Post to multiple platforms simultaneously (Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok, Pinterest)
- Schedule posts across all platforms
- Analytics and performance tracking
- Hashtag suggestions and content optimization

### 🧠 AI-Powered Intelligence
- Context-aware assistance based on time, location, and energy
- Smart automation workflows between services
- Personalized insights and recommendations
- Natural language processing for all interactions

### 📊 Life Tracking & Analytics
- Comprehensive life metrics (health, finance, learning, habits)
- Productivity analytics and pattern recognition
- Goal tracking and progress visualization
- Personal growth insights

### 🔧 Smart Automation
- Create custom workflows between services
- Time-based and event-triggered automations
- Cross-app task automation
- Intelligent reminders and notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Firebase project (already configured)
- GLM API key (already configured)
- GROQ API key (already configured)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/omni-universal-assistant.git
cd omni-universal-assistant
```

### 2. Install dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend (from project root)
npm install
```

### 3. Manual Setup (Alternative)
```bash
# Backend Setup
cd backend
pip install -r requirements.txt

# Frontend Setup
cd ../src
npm install
```

### 4. Environment Configuration
- Frontend `.env` (project root)
  - `REACT_APP_API_URL=http://localhost:5000/api`
  - Firebase web config (already present in `src/firebase/config.js`)
- Backend `.env` (in `backend/`)
  - Add provider secrets when ready (you can add later, wiring already done):
    - `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_BEARER_TOKEN`
    - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
    - `META_APP_ID`, `META_APP_SECRET` (Instagram/Facebook)
    - `SLACK_BOT_TOKEN`
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional)
    - Optional push: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

### 5. Test AI Models (Optional)
```bash
# Test that your AI models are working
python test_ai_models.py
```

### 6. Run the Application
```bash
# Option 1: Use the development script (starts both servers)
python start_dev.py

# Option 2: Start manually
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend (from project root)
npm start
```

Visit `http://localhost:3000` to access Omni!

## 🏗️ Architecture

### Frontend (React + Material-UI)
- **Components**: Modular, reusable UI components
- **Pages**: Dashboard, Tasks, Communication, Social Media, Life Tracker, Analytics
- **State Management**: Zustand for global state
- **Authentication**: Firebase Auth with Google and email/password
- **Database**: Firestore for user data and social media credentials

### Backend (Python + Flask)
- **AI Agent**: Multi-model AI assistant (GLM, GROQ)
- **Service Connectors**: Universal integration layer for 20+ services
- **Context Engine**: AI-powered context awareness and personalization
- **Automation Engine**: Smart workflow automation
- **Social Proxy**: `/api/social/publish` endpoint called by the frontend. Replace provider stubs in `backend/social_providers.py` with real API calls when you add secrets.

### Key Technologies
- **Frontend**: React, Material-UI, Framer Motion, React Query
- **Backend**: Python, Flask, LangChain, GLM, GROQ
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: GLM-4, GROQ (Llama3), LangChain agents
- **APIs**: RESTful API with WebSocket support

## 📱 Features Deep Dive

### Universal Task Management
```javascript
// Create a task that automatically goes to the best service
await createTask({
  title: "Prepare quarterly report",
  description: "Include Q3 metrics and projections",
  priority: "high",
  dueDate: "2024-01-15",
  service: "auto" // Omni chooses the best platform
});
```

### Social Media Management
```javascript
// Post to multiple platforms simultaneously
await postToPlatforms({
  content: "Exciting news! We're launching our new feature 🚀",
  platforms: ["facebook", "twitter", "linkedin", "instagram"],
  mediaUrls: ["https://example.com/image.jpg"],
  scheduledTime: new Date("2024-01-15T10:00:00Z")
});
```

### Smart Automation
```javascript
// Create automation: When task completed, post celebration
await createAutomation({
  name: "Task Completion Celebration",
  trigger: "task_completed",
  actions: [
    {
      type: "send_message",
      message: "🎉 Great job completing that task!",
      platform: "slack"
    },
    {
      type: "post_content",
      content: "Just completed another task! #productivity #success",
      platforms: ["twitter", "linkedin"]
    }
  ]
});
```

## 🔌 Supported Services

### Task Management
- ✅ Todoist
- ✅ Google Tasks
- ✅ Asana
- ✅ Notion
- ✅ Microsoft To-Do

### Communication
- ✅ Gmail
- ✅ Slack
- ✅ Microsoft Teams
- ✅ WhatsApp (via API)
- ✅ SMS

### Social Media (wired for posting via proxy)
- ✅ Facebook (via proxy route)
- ✅ Twitter/X (via proxy route)
- ✅ Instagram (via proxy route)
- ✅ LinkedIn (via proxy route)
- TikTok/YouTube/Pinterest can be added similarly

### Calendar & Scheduling
- ✅ Built-in Calendar (Firestore-backed) with notifications

### Productivity
- ✅ Notion
- ✅ Evernote
- ✅ OneNote
- ✅ Trello

## 🎨 UI/UX Features

### Modern Design
- **Material-UI**: Beautiful, accessible components
- **Glass Morphism**: Modern, elegant visual effects
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: User preference support

### Animations & Interactions
- **Framer Motion**: Smooth, delightful animations
- **Micro-interactions**: Engaging user feedback
- **Loading States**: Clear progress indicators
- **Error Handling**: User-friendly error messages

### Accessibility
- **WCAG Compliant**: Accessible to all users
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with assistive technologies
- **High Contrast**: Support for visual impairments

## 🧠 AI Capabilities

### Context Awareness
- **Time-based**: Adapts to morning, afternoon, evening
- **Energy levels**: Adjusts recommendations based on user energy
- **Location**: Location-aware suggestions
- **Mood**: Emotional state consideration

### Smart Suggestions
- **Task prioritization**: AI-powered task ordering
- **Content optimization**: Social media post improvements
- **Automation recommendations**: Suggest useful workflows
- **Productivity insights**: Personal efficiency analysis

### Natural Language Processing
- **Conversational AI**: Natural chat interface
- **Intent recognition**: Understands user goals
- **Multi-language**: Support for multiple languages
- **Voice commands**: Voice interaction support (coming soon)

## 📊 Analytics & Insights

### Personal Analytics
- **Productivity metrics**: Task completion rates, focus time
- **Communication patterns**: Message frequency, response times
- **Social media performance**: Engagement rates, reach
- **Life balance**: Work-life balance indicators

### AI-Powered Insights
- **Pattern recognition**: Identify productivity patterns
- **Recommendation engine**: Personalized suggestions
- **Trend analysis**: Long-term behavior trends
- **Goal tracking**: Progress toward personal goals

## 🔒 Privacy & Security

### Data Protection
- **End-to-end encryption**: Secure data transmission
- **Local storage**: Sensitive data stays on device
- **GDPR compliant**: European privacy standards
- **Data minimization**: Only collect necessary data

### Authentication
- **Multi-factor authentication**: Enhanced security
- **OAuth integration**: Secure third-party connections
- **Session management**: Secure user sessions
- **Role-based access**: Granular permissions

## ✅ Testing

### Automated tests location
- See `tests/` folder
  - `tests/backend/test_health.py`: backend health check
  - `tests/backend/test_social_publish.py`: social publish proxy
  - `tests/manual_checklist.md`: manual flows checklist
  - `tests/frontend/smoke.md`: front-end smoke checklist

### Run backend tests
```bash
cd tests/backend
python -m pytest -q
```

### Manual smoke checklist
- Social Media: connect account (username/password), create post (immediate publish)
- Calendar: add/list/delete events; notifications fire at scheduled times
- Automations: create automation; list renders without errors
- Dashboard: View All buttons navigate to /tasks and /communication
- PWA: install prompt on login page

## 🚀 Deployment

### Development
```bash
npm run dev  # Runs both frontend and backend
```

### Production
```bash
# Build frontend
npm run build

# Deploy backend
cd backend
gunicorn app:app

# Deploy frontend (Netlify, Vercel, etc.)
npm run build
```

### Docker
```bash
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LangChain**: For the amazing AI agent framework
- **Material-UI**: For the beautiful component library
- **Firebase**: For authentication and database services
- **OpenAI**: For the powerful AI capabilities
- **React Community**: For the excellent ecosystem

## 📞 Support

- **Documentation**: [docs.omni-assistant.com](https://docs.omni-assistant.com)
- **Discord**: [Join our community](https://discord.gg/omni-assistant)
- **Email**: support@omni-assistant.com
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/omni-universal-assistant/issues)

## 🌟 Roadmap

### Phase 1 (Current)
- ✅ Core task management
- ✅ Communication centralization
- ✅ Social media management
- ✅ Basic AI assistance

### Phase 2 (Q2 2024)
- 🔄 Voice commands
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics
- 🔄 Team collaboration

### Phase 3 (Q3 2024)
- 📋 AI content generation
- 📋 Advanced automation
- 📋 Integration marketplace
- 📋 Enterprise features

### Phase 4 (Q4 2024)
- 📋 AR/VR integration
- 📋 IoT device control
- 📋 Advanced AI models
- 📋 Global expansion

---

**Transform your digital life with Omni - The Universal Life Connector** 🌐✨

*Built with ❤️ by the Omni team*
