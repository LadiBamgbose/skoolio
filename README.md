<div align="center">

# Skoolio

### AI-powered quiz generation platform built as a production-grade SaaS system.

</div>

<div align="center">
  <video src="./media/skoolio-demo.mp4" width="900" controls></video>
</div>

---

## 🚀 Overview

Skoolio is a full-stack AI SaaS platform that enables teachers to generate grade-appropriate quizzes in seconds.

The system supports:
- Anonymous and authenticated quiz generation
- Subscription billing with plan enforcement
- Shareable quiz links for students (no account required)
- Real-time analytics and performance tracking
- Structured LLM validation before database persistence

This project was built and deployed as a real production system at:

**https://skoolio.app**

---

## 🎯 What This Project Demonstrates

- **Founder Execution**  
  Built and deployed a monetized SaaS with Stripe subscriptions, webhook lifecycle handling, and usage-based plan enforcement.

- **Systems Engineering**  
  Designed a structured LLM generation pipeline with response validation and JSON enforcement before persistence.

- **Production Architecture**  
  Implemented authentication, quota systems, billing cycles, and database relationships with cascading integrity.

- **Full-Stack Development**  
  React + TypeScript frontend  
  Express + Node backend  
  Prisma ORM + PostgreSQL  
  OpenAI integration  
  Stripe billing system  

---

## 🧠 Core Product Flow

### 1️⃣ Quiz Generation
Teacher (or anonymous user) submits:
- Topic
- Grade level
- Question count

System:
- Validates usage quota
- Calls OpenAI (GPT-4o-mini)
- Enforces structured JSON output
- Stores quiz in PostgreSQL
- Generates unique 6-digit share code

---

### 2️⃣ Student Experience
Student:
- Enters share code
- Takes quiz (no account required)
- Submits responses

System:
- Calculates score server-side
- Stores responses
- Updates analytics

---

### 3️⃣ Teacher Dashboard
Teacher can:
- View quizzes (paginated)
- See usage for billing cycle
- Track total responses
- Monitor average, highest, and lowest scores
- Toggle quiz activation
- Delete quizzes (cascade delete enabled)

---

## 🏗 Architecture

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- React Table
- Zod + React Hook Form
- Framer Motion
- Stripe React SDK

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Helmet + CORS security middleware

### AI Layer
- OpenAI API (GPT-4o-mini)
- Centralized prompt templates
- Structured validation before database write

### Billing
- Stripe Checkout
- Stripe Customer Portal
- Webhook subscription lifecycle handling

---

## 🔒 Engineering Highlights

- Dual quota enforcement  
  - Billing-cycle limits for authenticated users  
  - Rolling 30-day IP limits for anonymous users  

- Structured LLM validation pipeline  
  Ensures AI responses conform to required quiz schema before persistence  

- Unique 6-digit share code generation  
  Collision detection + retry logic  

- Cascading relational schema  
  Quiz deletion automatically removes responses and stats  

- Optional-auth middleware  
  Same endpoint supports anonymous + authenticated generation  

---

## 📊 Database Design

Core models:
- User
- Quiz
- QuizResponse
- QuizStats
- QuizUsage

Relationships:
- User → Quiz (one-to-many)
- Quiz → QuizResponse (one-to-many)
- Quiz → QuizStats (one-to-one)
- User/IP → QuizUsage (monthly tracking)

Indexes implemented for performance:
- shareLink
- teacherId + createdAt
- ipAddress + createdAt

---

## ⚙️ Local Development

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Required Environment Variables

#### Backend (.env in /backend)

- DATABASE_URL
- JWT_SECRET
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_TEACHER
- STRIPE_PRICE_ADVANCED
- APP_URL

#### Frontend (.env in /frontend)

- VITE_API_URL
- VITE_MIXPANEL_TOKEN (optional)
