# NuxBox - Deploy to Railway ($5-20/month)

Railway offers excellent developer experience with usage-based pricing. Perfect if you prefer visual deployment and don't mind $10-20/month.

---

## Step 1: Prepare Repository

1. **Push to GitHub** (same as Render):
   ```bash
   git init
   git add .
   git commit -m "NuxBox"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nuxbox.git
   git push -u origin main
   ```

---

## Step 2: Create Railway Account

1. Go to **https://railway.app**
2. Click **Start Project**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your repositories

---

## Step 3: Create New Project

1. Click **Create New Project** (or **New**)
2. Select **Deploy from GitHub repo**
3. Find and select your `nuxbox` repository
4. Click **Deploy Now**

---

## Step 4: Add PostgreSQL Database

1. In Railway Dashboard, click **Add** (or **+ New**)
2. Select **PostgreSQL** from marketplace
3. Railway automatically creates the database

---

## Step 5: Configure Environment Variables

1. Click on your **Node.js service**
2. Go to **Variables** tab
3. Add these variables:

```
DATABASE_URL = your-postgres-connection-string
SESSION_SECRET = random-32-char-secret
NODE_ENV = production
PORT = 3000
```

Railway automatically provides `DATABASE_URL` for PostgreSQL service. Copy from PostgreSQL service variables.

---

## Step 6: Set Build & Start Commands

1. Go to **Deployments** tab
2. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

---

## Step 7: Connect PostgreSQL & Deploy

1. Create a new **Deployment** to trigger build
2. Railroad will:
   - Pull your repo
   - Install dependencies
   - Build application
   - Start services
3. Click on your service to get the public URL

---

## Step 8: Setup Database Schema

Run your SQL schema on the PostgreSQL database:

```bash
# Using psql
psql "your-database-url" < database/schema.sql
```

Or use Railway's SQL editor in dashboard.

---

## Pricing (2025)

- **Usage-based billing** (no free tier)
- Typical project: **$10-20/month**
- PostgreSQL: Included in usage
- Can set spending limits

---

## Quick Comparison: Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| Free Tier | ✅ Yes ($0) | ❌ No |
| Ease of Use | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| Visual Dashboard | Good | Excellent |
| Developer Experience | Good | Excellent |
| Cost (small project) | $0-14/mo | $10-20/mo |
| Cold Starts | 30-60s | Minimal |

---

**Best for:** Teams willing to pay for better UX and no cold starts.

See `DEPLOY_TO_RENDER.md` for the free option.
