# 📚 Curriculum Manager

A full-stack web application for uploading, managing, and analyzing educational curricula using AI-powered insights. Get comprehensive curriculum evaluation, identify outdated topics, and receive recommendations for improvement.

## ✨ Features

- **📤 Curriculum Management** - Upload XLS files, organize by batches
- **🤖 AI-Powered Analysis** - Uses local Qwen 2.5 3B model via Ollama
- **📊 Interactive Dashboard** - Visualize effectiveness scores, trends, gaps
- **💡 Smart Recommendations** - Identify outdated topics and suggest improvements
- **🏢 Batch Organization** - Manage multiple curriculum batches
- **🔒 Privacy First** - All analysis runs locally, no external API calls (by default)
- **🚀 Cloud Ready** - Switch to OpenAI/Claude with single env var change

## 🎯 Quick Demo

1. Upload a curriculum (XLS format)
2. AI analyzes it against 7 industry categories: Programming, AI/ML, Cloud, DevOps, Data Science, Security, Soft Skills
3. Get instant insights: effectiveness score, trend comparison, week-by-week analysis
4. See recommendations for gaps and improvements

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, TailwindCSS, Recharts
- **Backend:** Next.js API Routes, Node.js
- **Database:** SQLite + Prisma ORM
- **AI:** Ollama (local) or OpenAI/Claude (cloud)
- **Deployment:** Docker, Vercel, self-hosted servers

## 📋 Prerequisites

### Required
- **Node.js** 18+ (tested with v24.14.1)
- **npm** 11+ or yarn

### For Local AI Analysis (Default)
- **Ollama** ([https://ollama.ai](https://ollama.ai))
- **Qwen 2.5 3B Model** (automatically downloaded with `ollama pull`)

### For Cloud AI Analysis (Optional Alternative)
- **OpenAI API Key** or **Anthropic API Key** (if using cloud instead of Ollama)

## 🚀 Quick Start (Local Development)

### 1️⃣ Install Ollama

```bash
# Download from https://ollama.ai
# Or on macOS with Homebrew:
brew install ollama
```

### 2️⃣ Clone & Setup Repository

```bash
git clone https://github.com/Ppylgoy9r/curriuculum_manager.git
cd curriculum

npm install
npx prisma migrate dev --name init
```

### 3️⃣ Start Ollama Service (In Separate Terminal)

```bash
ollama pull qwen2.5:3b    # Downloads the model (~2GB)
ollama serve               # Starts on http://localhost:11434
```

### 4️⃣ Start Development Server

```bash
npm run dev
# Opens http://localhost:3000
```

### 5️⃣ Use the Application

1. **Create a Batch:** Go to "Batches & Upload" tab, create a new batch
2. **Upload Curriculum:** Upload an XLS file with your curriculum data
3. **Run Analysis:** Click "Analyze" on a curriculum
4. **View Results:** Check the "Analysis Dashboard" tab for insights

---

## 📁 Project Structure

```
curriculum/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── batch/              # Batch CRUD endpoints
│   │   │   ├── curriculum/         # Curriculum management
│   │   │   └── analyze/            # AI analysis endpoint
│   │   ├── page.tsx                # Main dashboard
│   │   └── layout.tsx
│   ├── components/                 # Reusable React components
│   ├── hooks/                      # Custom React hooks
│   └── lib/
│       ├── db.ts                   # Prisma client
│       └── llm.ts                  # LLM provider abstraction
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # DB migrations
├── db/
│   └── custom.db                   # SQLite database (auto-created)
├── SETUP.md                        # Detailed deployment guide
├── .env.example                    # Environment template
├── package.json
└── tsconfig.json
```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database (default: SQLite)
DATABASE_URL=file:../db/custom.db

# LLM Provider Selection: "ollama" (default), "openai", or "anthropic"
LLM_PROVIDER=ollama

# For Local Ollama (Default)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b

# For OpenAI Cloud (Alternative)
# OPENAI_API_KEY=sk-your-key-here
# LLM_PROVIDER=openai
# LLM_MODEL=gpt-3.5-turbo

# For Anthropic Claude Cloud (Alternative)
# ANTHROPIC_API_KEY=sk-ant-your-key-here
# LLM_PROVIDER=anthropic
# LLM_MODEL=claude-3-sonnet-20240229
```

### Switch to Cloud AI

To use OpenAI or Claude instead of local Ollama:

```bash
# In .env, change to:
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key
```

That's it! No code changes needed. The app automatically uses the configured provider.

---

## 📡 API Endpoints

### Batch Management
- `GET /api/batch` - Get all batches
- `POST /api/batch` - Create new batch
- `DELETE /api/batch?id=<id>` - Delete batch

### Curriculum Management
- `GET /api/curriculum/upload` - Get curricula (supports batch filtering)
- `POST /api/curriculum/upload` - Upload XLS file

### AI Analysis
- `POST /api/analyze` - Run curriculum analysis

**Example Analysis Request:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"curriculumId": "curriculum_id_here"}'
```

**Example Response:**
```json
{
  "success": true,
  "analysis": {
    "effectivenessScore": 75,
    "overallScore": 80,
    "summary": "The curriculum covers a broad range of automation and testing skills...",
    "outdatedTopics": [
      {
        "topic": "RPA Basics",
        "reason": "RPA tools have evolved significantly",
        "week": 9
      }
    ],
    "recommendedTopics": [
      {
        "topic": "Machine Learning Basics",
        "priority": "high",
        "suggestedWeek": 10
      }
    ],
    "weekAnalysis": [...],
    "trendComparison": {
      "categories": ["Programming", "AI/ML", "Cloud", ...],
      "curriculumScore": [60, 35, 40, ...],
      "industryDemand": [90, 80, 70, ...],
      "gap": [-25, -45, -30, ...]
    }
  }
}
```

---

## 🏗️ Deployment

### Option 1: Local Machine (Recommended for Learning)

```bash
# Just follow "Quick Start" above
npm run dev
```

### Option 2: Self-Hosted Server with Ollama

1. Install Ollama on the server
2. Deploy the Next.js app
3. Update `.env` with server IP:
   ```
   OLLAMA_URL=http://server-ip:11434
   ```

### Option 3: Cloud Hosting (Vercel, Heroku, Railway)

1. Change to cloud LLM provider:
   ```
   LLM_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key
   ```
2. Deploy as normal - no Ollama needed!

**See SETUP.md for detailed deployment guide including Docker & Kubernetes.**

---

## 📊 Dashboard Features

### Batches & Upload Tab
- Create new curriculum batches
- Upload XLS files with curriculum structure
- View uploaded curricula

### Analysis Dashboard Tab
- Effectiveness score (0-100)
- Overall quality rating
- Executive summary
- Industry trend comparison (bar, radar charts)
- Gap analysis across 7 categories
- Week-by-week relevance scores

### Recommendations Tab
- List of outdated topics with reasons
- Recommended topics to add
- Priority levels (high/medium/low)
- Week placement suggestions

---

## 🐛 Troubleshooting

### Error: "Ollama service is not running"
```bash
# Solution: Start Ollama in a separate terminal
ollama serve
```

### Error: "Model qwen2.5:3b not found"
```bash
# Solution: Pull the model first
ollama pull qwen2.5:3b
```

### Error: "Port 11434 already in use"
```bash
# Kill existing Ollama process
pkill -f ollama

# Or use a different port
OLLAMA_HOST=127.0.0.1:11435 ollama serve
```

### Database errors on first run
```bash
# Solution: Run migrations
npx prisma migrate dev
```

### Analysis takes 60+ seconds
- **First analysis:** Loads model into memory (~30-60s) - normal
- **Subsequent analyses:** Faster (~5-10s)

---

## 🧪 Testing

### Test API Endpoints

```bash
# Get all batches
curl http://localhost:3000/api/batch

# Test analysis (replace with real ID)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"curriculumId": "test-id"}'

# Check if Ollama is running
curl http://localhost:11434/api/tags
```

---

## 📊 Curriculum XLS Format

The uploaded XLS file should have columns:
- Week (number)
- Category (topic area)
- Topic (specific topic)
- Hours (duration)
- Tools (technology/tool)
- Outcome (learning outcome)

Example:
```
1 | Introduction to Automation | What is Automation? | 2 | - | Understand basics
2 | Programming Basics | Python Fundamentals | 4 | Python | Write basic programs
3 | Version Control | Git Basics | 3 | Git | Understand version control
```

---

## 🔄 Development Workflow

### Run Tests (if added)
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

### Format Code
```bash
npm run format
```

### Lint Code
```bash
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

- **Documentation:** See [SETUP.md](./SETUP.md) for detailed deployment guide
- **Issues:** Open an issue on GitHub
- **Email:** Create an issue with the "question" label

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [Ollama Models](https://ollama.ai/library)
- [Recharts Documentation](https://recharts.org)

---

## 🗺️ Roadmap

- [ ] Advanced filtering and search
- [ ] Export analysis as PDF/DOCX
- [ ] Comparison between multiple curricula
- [ ] Custom evaluation metrics
- [ ] User authentication and permissions
- [ ] Scheduled analysis reports
- [ ] Integration with LMS platforms
- [ ] Mobile app

---

## 🔐 Security Notes

- **Local Ollama:** All data stays on your machine
- **Cloud APIs:** Data is sent to OpenAI/Claude/etc. (review their privacy policies)
- **Database:** SQLite is local-only, add authentication before production deployment
- **API Keys:** Never commit `.env` file with real keys (use `.env.local` for development)

---

**Built with ❤️ by Ishan Kumar**

**Last Updated:** May 6, 2026

---

## Quick Links

- 📖 [Detailed Setup Guide](./SETUP.md)
- 🔧 [Environment Configuration](./.env.example)
- 📚 [API Documentation](#-api-endpoints)
- 🐛 [Troubleshooting](#-troubleshooting)
