# HackRx Medical AI Assistant

## Overview
**Medical Intelligent Assistant** is an AI-powered tool designed to assist healthcare professionals with their administrative tasks, such as documentation, patient summaries, and follow-ups so they can focus more on patient care.

## Features
- AI summary
- Voice-to-text summary
- AI Chatbot
  
## Team
| Name | Role |
| ----------- | ----------- |
| Jack Lee | Backend Engineer |
| Nezo | Project Lead/UX UI Designer |
| Jackson | Frontend Engineer |
| Ameera | Data Analyst |
| Jia Ean | Project Lead/Data Analyst |

## Tech Stack
Frontend
- Next.js 15
- JavaScript
- TailwindCSS
- Vercel

Backend
- FastAPI
- Python
- Pydantic
- Haystack
- Dokploy
- Docker
- GCP
- Vertex AI
- Hetzner
- Groq
- Ollama
- GitHub Actions
- GitHub Container Registry (GHCR)

Deployment
- Frontend (Vercel)
  - Public URL
  - Optimized build for Next.js
  - Integration with GitHub, CI/CD triggered by webhooks
- Backend (Hetzner)
  - VPS with medium specs (8 CPUs + 16 GB RAM), applications managed by Dokploy
  - Integrated with GitHub, CI/CD triggered by webhooks, dockerized image push to GHCR and fetched by Dokploy for deployment
  - Serve RESTful API endpoints to frontend via secure API-KEY authentication and CORS

Generative AI
- Ollama (Development)
  - Qwen3-8B (Complex Reasoning)
  - Llama3.2-3B (Chatbot)
- Groq (Production)
  - Llama-3.3-70B-Versatile (Complex Reasoning)
  - Llama-3.1-8B-Instant (Chatbot)
  - Gemini 2.5 Flash-Lite (Speech-to-text)


## Getting Started
click the webpage to get started: https://hackrx-mymia.vercel.app/login
