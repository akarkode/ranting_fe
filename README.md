🌿 Ranting AI Assistant (Frontend)

📌 What is Ranting AI?
Ranting AI is an intelligent assistant application powered by AI that helps users with conversations, document analysis, and image generation.
The frontend is built with React + Vite featuring a modern and responsive UI.

------------------------------------------------------------

🔗 Integrations
- Ranting AI Backend (FastAPI + Redis) → for chat streaming, history, and conversation storage
- Google OAuth → user authentication
- OpenAI API → natural language processing, file analysis, and image generation
- Redis → temporary conversation history storage

------------------------------------------------------------

✨ Features
- Google Login (OAuth 2.0)
- Interactive chat with AI (character-by-character streaming)
- File upload & analysis (documents or images)
- AI image generation from prompts
- Conversation history saved automatically
- Code highlighting + copy button in AI responses
- Typing indicator while AI responds
- Auto logout & redirect when token expires (401)
- Responsive modern UI with toast notifications
- Dockerized build with Nginx optimization

------------------------------------------------------------

⚙️ Requirements
- Node.js >= 20
- npm >= 9
- Docker (optional)

------------------------------------------------------------

🚀 Getting Started (Development)

1. Install dependencies
   npm install

2. Run dev server
   npm run dev

Default: http://localhost:5173

------------------------------------------------------------

🌐 Environment Variables
Set variables (in .env or Docker build args):

VITE_API_URL=https://ranting.akarkode.com/api/ai
VITE_AUTH_URL=https://ranting.akarkode.com/api/auth

------------------------------------------------------------

🐳 Run with Docker

Build:
docker build \
  --build-arg VITE_API_URL=https://ranting.akarkode.com/api/ai \
  --build-arg VITE_AUTH_URL=https://ranting.akarkode.com/api/auth \
  -t rantingai-fe .

Run:
docker run -p 8080:8080 rantingai-fe

App will be available at: http://localhost:8080

------------------------------------------------------------

📦 Production Notes
- Nginx optimized with gzip & static asset caching
- SPA fallback (index.html) handles 404
- Docker image is based on nginx:alpine, lightweight & secure (non-root user)

------------------------------------------------------------

👨‍💻 License
MIT – Powered by Akarkode (https://akarkode.com)
