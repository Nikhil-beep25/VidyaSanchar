# Production Deployment Guide - VidyaSanchar ERP

This guide outlines step-by-step procedures to deploy the VidyaSanchar School ERP platform to production services (Vercel for Frontend, Render/Railway for Backend/Database).

---

## 📦 1. Git & GitHub Repository Sync

If you need to push the code to a new GitHub repository:

```bash
# Rename default branch to main
git branch -m main

# Add your GitHub remote URL
git remote add origin https://github.com/your-username/vidyasanchar-erp.git

# Push the codebase to GitHub
git push -u origin main
```

---

## 🔒 2. Environment Variables Configuration

### Backend Environment Configuration (`.env`)
PaaS hosts (Render/Railway) must be configured with these environment variables in their dashboard settings:

| Variable | Recommended Value / Details |
|---|---|
| `PORT` | `5001` (Or dynamically set by host, e.g. `10000`) |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Connection URL from hosted database (e.g. `postgresql://...`) |
| `JWT_SECRET` | Long secure random string for JWT accessToken |
| `JWT_REFRESH_SECRET` | Long secure random string for JWT refreshToken |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins (e.g. `https://vidyasanchar.vercel.app`) |

### Frontend Environment Configuration (Vercel)
Set the following environment variable inside the Vercel project settings:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Deployed backend API URL (e.g. `https://vidyasanchar-backend.onrender.com/api`) |

---

## 🚀 3. Frontend Deployment (Vercel)

Vercel hosts the React client as a fast, static Single Page Application (SPA).

### Step-by-Step Vercel Setup:
1. Log in to the [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
2. Import your GitHub repository `vidyasanchar-erp`.
3. In the project configure settings:
   - **Framework Preset**: Select `Vite` (Vercel auto-detects this).
   - **Root Directory**: Select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand the **Environment Variables** panel and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-api-subdomain.onrender.com/api`
5. Click **Deploy**.

> [!NOTE]
> The included `frontend/vercel.json` file handles React Router redirects, rewriting page refresh requests back to `index.html` to prevent `404 Not Found` errors.

---

## 🖥️ 4. Backend Deployment (Render or Railway)

The Node/Express backend requires a live server instance and a database connection.

### Option A: Render.com Setup
1. Log in to [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. In settings:
   - **Root Directory**: Select `backend`
   - **Runtime**: Select `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add all environment variables listed in the "Backend Environment Configuration" section above.
5. In **Advanced Settings**, ensure you link your Database service URL in the `DATABASE_URL` property.

### Option B: Railway.app Setup
1. Open the [Railway Dashboard](https://railway.app) and click **New Project** > **Deploy from GitHub**.
2. Select your repository.
3. Under variables, add all environment variables.
4. Railway will auto-detect the root `backend/package.json` scripts and run `npm run build` followed by `npm run start`.

---

## 💾 5. Database Deployment & Migration

### Step 1: Provision PostgreSQL
- **On Render**: Click **New** > **PostgreSQL** and create a database instance. Copy the **External Connection String**.
- **On Railway**: Click **Add** > **Database** > **Add PostgreSQL**. Copy the **Connection URL**.

### Step 2: Push Schema & Seed
To run migrations and seed the production database locally from your terminal, execute:

```bash
# Push schema and execute migrations on remote PostgreSQL database
DATABASE_URL="your-production-postgresql-url" npx prisma db push

# Seed the production database with Indian credentials/context
DATABASE_URL="your-production-postgresql-url" npx ts-node prisma/seed.ts
```

Alternatively, you can trigger seeding from the remote build logs using your deployment scripts.
