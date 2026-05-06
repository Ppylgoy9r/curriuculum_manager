# Curriculum Manager - Setup Guide

## System Requirements

### 1. **Node.js & NPM**
- Node.js 18+ (tested with 24.14.1)
- npm 11+

### 2. **Database**
- SQLite (automatic, included)
- Prisma ORM

### 3. **AI Model (Required for Curriculum Analysis)**

#### Option A: Local Ollama (Recommended for Development)
**Requirements:**
- Ollama installed ([https://ollama.ai](https://ollama.ai))
- Qwen 2.5 3B model downloaded
- Ollama service running on port 11434

**Setup Steps:**
```bash
# 1. Install Ollama (if not already installed)
# Download from: https://ollama.ai

# 2. Pull the Qwen model
ollama pull qwen2.5:3b

# 3. Start Ollama service (in a separate terminal)
ollama serve
```

The app will automatically connect to `http://localhost:11434/api/generate`

**Pros:**
- ✅ No API costs
- ✅ 100% private (no external API calls)
- ✅ Offline capability
- ✅ Fast after model is loaded

**Cons:**
- ❌ Requires local machine resources (4GB+ RAM recommended)
- ❌ First analysis takes ~30-60 seconds (model loading)

#### Option B: Cloud-Hosted (For Production/Deployment)
Currently requires code modification. See "Deployment" section below.

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ppylgoy9r/curriuculum_manager.git
cd curriculum

# 2. Install dependencies
npm install

# 3. Set up the database
npx prisma migrate dev --name init

# 4. Start Ollama (in a separate terminal)
ollama serve

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## What Users Need to Do After Cloning

### ✅ If Using Locally (Recommended)
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Run: `ollama pull qwen2.5:3b`
3. Start Ollama: `ollama serve`
4. Install dependencies: `npm install`
5. Start app: `npm run dev`
6. Open `http://localhost:3000` in browser

### ❌ If They Don't Install Ollama
The curriculum analysis will **FAIL** with error:
```
"Ollama service is not running. Please start Ollama and ensure the qwen2.5:3b model is available."
```

---

## Deployment Scenarios

### Scenario 1: Self-Hosted Server (Works with Local Ollama)
If deploying to a server where Ollama is also installed:
- ✅ Works as-is
- Keep `OLLAMA_URL=http://localhost:11434`

### Scenario 2: Cloud Hosting (Heroku, Vercel, Railway, etc.)
**Problem:** Ollama can't run in most cloud container environments
- ❌ Analysis feature will NOT work
- ⚠️ App runs but analysis endpoint fails

**Solution:** Need to modify the code to use a cloud LLM API instead:
- Switch to OpenAI API
- Switch to Anthropic Claude API
- Switch to a hosted Ollama service
- Use other cloud LLM providers

### Scenario 3: Docker Container (Monolithic)
```dockerfile
FROM node:18
RUN curl https://ollama.ai/install.sh | sh
WORKDIR /app
COPY . .
RUN npm install
RUN ollama pull qwen2.5:3b
EXPOSE 3000 11434
CMD ["sh", "-c", "ollama serve & npm run dev"]
```

This requires significant Docker & DevOps setup.

---

## Current Architecture

```
┌─────────────────────────────┐
│   Frontend (Next.js)        │
│  - Batch Management         │
│  - File Upload              │
│  - Analysis Dashboard       │
└──────────┬──────────────────┘
           │
    ┌──────▼──────────┐
    │  Next.js APIs   │
    │  - /api/batch   │
    │  - /api/analyze │
    └──────┬──────────┘
           │
    ┌──────▼──────────────┐
    │  Prisma + SQLite    │
    │  (Local Database)   │
    └─────────────────────┘
           │
    ┌──────▼──────────────┐
    │  Ollama API         │
    │  (localhost:11434)  │
    └─────────────────────┘
           │
    ┌──────▼──────────────┐
    │  Qwen 2.5 3B Model  │
    │  (Local LLM)        │
    └─────────────────────┘
```

---

## Making It Work Anywhere

### Option 1: Make Ollama URL Configurable
```bash
# Add to .env
OLLAMA_URL=http://localhost:11434
# or
OLLAMA_URL=https://ollama-prod.myserver.com:11434
```

Then update the code:
```typescript
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
const response = await fetch(`${ollamaUrl}/api/generate`, { ... });
```

### Option 2: Switch to Cloud LLM API
Replace Ollama with one of:
- **OpenAI API** - `gpt-4-turbo`, `gpt-3.5-turbo`
- **Anthropic Claude API** - `claude-3-opus`, `claude-3-sonnet`
- **Mistral API** - Faster, cheaper alternative
- **Hosted Ollama** - Services like [Replicate](https://replicate.com)

### Option 3: Use Hybrid Approach
```typescript
const useLocalOllama = process.env.USE_LOCAL_OLLAMA === 'true';

if (useLocalOllama) {
  // Use local Ollama
  const response = await fetch('http://localhost:11434/api/generate', { ... });
} else {
  // Use cloud API (OpenAI, Claude, etc.)
  const response = await fetch('https://api.openai.com/v1/chat/completions', { ... });
}
```

---

## Environment Variables

### Current `.env` (Minimal)
```
DATABASE_URL=file:../db/custom.db
```

### Recommended `.env` (Extended)
```
# Database
DATABASE_URL=file:../db/custom.db

# Ollama Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b

# Or Cloud LLM API (if switching away from Ollama)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
```

---

## Testing

### Check if Ollama is Running
```bash
curl http://localhost:11434/api/tags
```

Should return a list of models.

### Test Analysis Endpoint
```bash
# First create a batch and upload a curriculum through the web UI,
# then get the curriculumId and run:

curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"curriculumId": "YOUR_CURRICULUM_ID"}'
```

---

## Troubleshooting

### Error: "Ollama service is not running"
**Solution:** Start Ollama in a separate terminal:
```bash
ollama serve
```

### Error: "Model qwen2.5:3b not found"
**Solution:** Pull the model first:
```bash
ollama pull qwen2.5:3b
```

### Analysis takes too long (>60 seconds)
- First request loads the model into memory (~30-60s) - normal
- Subsequent requests are faster (~5-10s)
- Consider using larger model if you have more RAM: `ollama pull mistral:latest`

### Port 11434 already in use
**Solution:** Change Ollama port or kill existing process:
```bash
# Kill existing Ollama
pkill -f ollama

# Or use different port
OLLAMA_HOST=127.0.0.1:11435 ollama serve
```

---

## Summary

| Scenario | Will It Work? | Setup Required |
|----------|---------------|-----------------|
| **Clone & Run Locally** | ✅ Yes | Ollama + `ollama pull qwen2.5:3b` |
| **Deploy to Vercel/Heroku** | ❌ No | Need to modify code to use cloud API |
| **Deploy to VPS with Ollama** | ✅ Yes | Change `OLLAMA_URL` to server IP |
| **Docker Container (with Ollama)** | ✅ Yes | Create custom Dockerfile |
| **Kubernetes Cluster** | ⚠️ Complex | Requires Ollama sidecar + network config |

**Recommendation:** For production deployment without Ollama infrastructure, switch to a cloud LLM API (OpenAI, Claude, Mistral) which requires minimal code changes.
