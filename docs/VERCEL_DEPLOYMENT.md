# Vercel Deployment Guide

This project supports **Unified Full-Stack Deployment** (both Frontend & Backend under 1 single Vercel project and 1 URL).

---

## 🌟 Quick Start: Deploy in 1 Single Vercel Project (Recommended)

With this setup:
- **Frontend Web UI** will load at: `https://your-app.vercel.app/`
- **Backend Serverless API** will load at: `https://your-app.vercel.app/api/...`

### Step 1: Open Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➔ **"Project"**.
2. Select your repository: `Parent_teacher_app`.

### Step 2: Configure Project Settings
Leave everything to their root defaults (Vercel automatically detects [`vercel.json`](file:///vercel.json) and [`package.json`](file:///package.json)):

| Setting | Value |
|---|---|
| **Framework Preset** | **`Other`** |
| **Root Directory** | `./` *(Default)* |
| **Build Command** | `npm run build` *(Auto-configured)* |
| **Output Directory** | `frontend/PTA-UI/dist` *(Auto-configured)* |
| **Install Command** | `npm install` *(Default)* |

### Step 3: Add Environment Variables
Add your MongoDB connection string and secrets:

| Variable Name | Example Value | Purpose |
|---|---|---|
| `DATABASE_URL` | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/parent_teacher_db?retryWrites=true&w=majority` | MongoDB Atlas Connection |
| `JWT_SECRET` | `your_strong_secret_key_123` | Secret for JWT authentication |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `NODE_ENV` | `production` | Production mode |

### Step 4: Click Deploy!
Click **"Deploy"**. Vercel will install dependencies, build the Expo web application, and mount your backend serverless functions.

> [!IMPORTANT]
> **MongoDB Atlas Network Access**: In your MongoDB Atlas Dashboard, go to **Network Access** and ensure `0.0.0.0/0` (Allow access from anywhere) is enabled so Vercel's serverless lambdas can communicate with your database.

---

## 🛠️ Monorepo Structure Reference
- **Root Vercel Config**: [`vercel.json`](file:///vercel.json)
- **Root Serverless API Entry**: [`api/index.js`](file:///api/index.js)
- **Root Package Dependencies**: [`package.json`](file:///package.json)
- **Backend Source Code**: [`backend/src/`](file:///backend/src/)
- **Frontend Source Code**: [`frontend/PTA-UI/`](file:///frontend/PTA-UI/)
