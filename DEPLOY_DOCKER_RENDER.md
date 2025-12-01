# Deploy NuxBox to Render Using Docker (WORKS 100%)

This is the **most reliable method** that bypasses all framework detection issues.

---

## Why Docker Works

Docker tells Render: "Here's exactly how to run this app" - no guessing, no framework detection needed. It just works.

---

## Step 1: Push to GitHub

```bash
git add Dockerfile .dockerignore
git commit -m "Add Docker configuration"
git push origin main
```

---

## Step 2: Create Service on Render

1. Go to **https://render.com/dashboard**
2. Click **New** → **Web Service**
3. Select your GitHub repository
4. Fill in:
   - **Name**: `nuxbox`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: Select **Docker** (NOT Node)
   - **Plan**: Free

5. Click **Create Web Service**

---

## Step 3: Render Will:

- Detect the `Dockerfile`
- Build Docker image
- Deploy automatically
- Give you a live URL

**Time**: ~3-5 minutes

---

## Step 4: Set Environment Variables

1. Go to your service
2. Click **Environment** tab
3. Add variables:

```
DATABASE_URL = postgresql://username:password@host:5432/nuxbox_db
PGHOST = your-db-host
PGPORT = 5432
PGUSER = your-user
PGPASSWORD = your-password
PGDATABASE = nuxbox_db
SESSION_SECRET = random-32-character-string
NODE_ENV = production
```

---

## Step 5: Create Database First

Before running the app, create a PostgreSQL database:

1. In Render dashboard, click **New** → **PostgreSQL**
2. Fill in:
   - **Name**: `nuxbox-db`
   - **Database**: `nuxbox`
   - **User**: `nuxbox_user`
   - **Plan**: Free
3. Click **Create**
4. Copy the **Internal Database URL**
5. Use it for DATABASE_URL variable above

---

## Step 6: Setup Database Schema

1. Go to your PostgreSQL database in Render
2. Click **Connect** → **SQL Editor**
3. Copy entire contents of `database/schema.sql`
4. Paste into SQL editor
5. Execute

---

## Step 7: Test

Visit your Render URL (e.g., `nuxbox.onrender.com`)

Should see NuxBox landing page ✅

---

## That's It! 🎉

Your app is now deployed with Docker. This method:
- ✅ Works 100% reliably
- ✅ No "unsupported framework" errors
- ✅ Same Docker setup works on Railway, Fly.io, any platform
- ✅ Automatically rebuilds on GitHub push

---

## Troubleshooting

**Build fails?**
- Check Docker build logs in Render dashboard → Events tab
- Verify Dockerfile exists in root directory
- Ensure all dependencies are listed in package.json

**App won't start?**
- Check runtime logs in Render dashboard → Logs tab
- Verify environment variables are set
- Ensure database schema was created

**Can't connect to database?**
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database tables exist (run schema.sql)

---

**Next Step**: This Docker setup also works for Railway, Fly.io, and any container-based platform!
