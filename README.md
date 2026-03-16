# 🤖 AI Dev Agent — GitHub Repo Analyzer

Analyze any GitHub repository with AI. Get instant insights on tech stack, strengths, and improvement suggestions — powered by Groq LLaMA 3.3.

## ✨ Features

- 🔍 Fetches live repo data from GitHub API
- 📊 Displays stars, forks, watchers, issues, language, topics
- 🤖 AI-powered summary, tech stack detection, strengths & improvements
- ⚡ Fast inference via Groq (free tier)
- 🎨 Dark, terminal-inspired UI

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repo
4. Add environment variable: `GROQ_API_KEY`
5. Deploy!

## 🔑 Getting API Keys

- **Groq API** (required): [console.groq.com](https://console.groq.com) — Free, no credit card
- **GitHub Token** (optional): Increases rate limit from 60 to 5000 req/hour

## 🛠 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- LangChain + Groq (LLaMA 3.3 70B)
- GitHub REST API
