# Vercel Deployment Guide

This project consists of two components:
1. **Backend**: Express REST API with MongoDB (`/backend`)
2. **Frontend**: Expo React Native Web App (`/frontend/PTA-UI`)

---

## 🚀 Recommended Deployment Approach: Two Vercel Projects

Deploying the frontend and backend as separate Vercel projects gives you independent deployments, environment isolation, and proper scaling.

---

### Part 1: Deploy Backend API

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➔ **"Project"**.
2. Select your Git repository: `Parent_teacher_app`.
3. In the project configuration:
   - **Project Name**: `parent-teacher-backend` (or your preferred name)
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and choose `backend`.
4. **Environment Variables**:
   Add the following variables in the Vercel Dashboard:

   | Key | Example Value | Description |
   |---|---|---|
   | `DATABASE_URL` | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/pta_db?retryWrites=true&w=majority` | MongoDB Atlas Connection String |
   | `JWT_SECRET` | `your_strong_random_jwt_secret_key` | Secret key for JWT signing |
   | `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
   | `NODE_ENV` | `production` | Environment mode |
   | `CLIENT_URL` | `https://parent-teacher-frontend.vercel.app` | Allowed CORS origin (can update after frontend is deployed) |

5. Click **Deploy**.
6. Note down your backend URL (e.g. `https://parent-teacher-backend.vercel.app`). Test `/health` or `/` in your browser.

> [!IMPORTANT]
> **MongoDB Atlas Network Access**: In your MongoDB Atlas Dashboard, go to **Network Access** and make sure `0.0.0.0/0` (Allow access from anywhere) is added so Vercel serverless IP addresses can connect.

---

### Part 2: Deploy Frontend App (PTA-UI Web)

1. Go back to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➔ **"Project"**.
2. Select the same Git repository: `Parent_teacher_app`.
3. In the project configuration:
   - **Project Name**: `parent-teacher-frontend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click **Edit** and choose `frontend/PTA-UI`.
   - **Build Command**: `npx expo export --platform web` (or `npm run build:web`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   Add the following variables:

   | Key | Value | Description |
   |---|---|---|
   | `EXPO_PUBLIC_API_URL` | `https://parent-teacher-backend.vercel.app/api/v1` | Pointing to your deployed backend |
   | `EXPO_PUBLIC_USE_MOCK` | `false` | Set to `false` for live backend API calls |

5. Click **Deploy**.
6. Once deployed, copy your frontend URL and update the `CLIENT_URL` environment variable in your backend Vercel project settings if needed.

---

## 💻 Alternative: Deploying via Vercel CLI

If you have `vercel` CLI installed globally (`npm i -g vercel`):

### 1. Deploy Backend:
```bash
cd backend
vercel
# Follow prompts, set Root Directory to ./
# Link or create new project: parent-teacher-backend
vercel --prod
```

### 2. Deploy Frontend:
```bash
cd ../frontend/PTA-UI
vercel
# Follow prompts, set Root Directory to ./
# Link or create new project: parent-teacher-frontend
vercel --prod
```

---

## 🛠️ Configuration Files Reference
- Backend Vercel Serverless Function: [backend/api/index.js](file:///backend/api/index.js)
- Backend Vercel Config: [backend/vercel.json](file:///backend/vercel.json)
- Frontend Vercel Config: [frontend/PTA-UI/vercel.json](file:///frontend/PTA-UI/vercel.json)
- Backend Environment Template: [backend/.env.example](file:///backend/.env.example)
- Frontend Environment Template: [frontend/PTA-UI/.env.example](file:///frontend/PTA-UI/.env.example)
