# NuxBox - Deploy to Render (FREE)

Render is the best free option for deploying NuxBox. It offers:
- ✅ Free tier with PostgreSQL database
- ✅ Git-based deployments (push to GitHub = auto-deploy)
- ✅ Free SSL/HTTPS
- ✅ 750 hours/month (enough for 1 always-on app)

---

## Step 1: Prepare Your Repository

1. **Create a GitHub account** if you don't have one: https://github.com

2. **Push your NuxBox code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "NuxBox - Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nuxbox.git
   git push -u origin main
   ```

   Or upload via GitHub web interface → Create new repository → Upload files

---

## Step 2: Create Render Account

1. Go to **https://render.com**
2. Click **Sign Up** (use GitHub for easier connection)
3. Authorize GitHub if prompted

---

## Step 3: Create PostgreSQL Database

1. Go to **Dashboard** → **New** → **PostgreSQL**
2. Fill in:
   - **Name**: `nuxbox-db`
   - **Database**: `nuxbox`
   - **User**: `nuxbox_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
3. Click **Create Database**
4. Wait for database to be created (2-3 minutes)
5. **Copy your Internal Database URL** (you'll need this)

Example format: `postgresql://user:password@dpg-xxxxxx.xyz:5432/nuxbox_db`

---

## Step 4: Create Web Service

1. Go to **Dashboard** → **New** → **Web Service**
2. Select your GitHub repository (authorize if needed)
3. Fill in settings:

   **Basic Settings:**
   - **Name**: `nuxbox`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

   **Environment Variables:**
   - Click **Add Environment Variable** and add:
   
   ```
   DATABASE_URL = postgresql://nuxbox_user:password@your-db-host:5432/nuxbox_db
   PGHOST = your-db-host
   PGPORT = 5432
   PGUSER = nuxbox_user
   PGPASSWORD = your-password
   PGDATABASE = nuxbox_db
   SESSION_SECRET = your-random-32-char-secret
   NODE_ENV = production
   PORT = 3000
   ```

   Replace with your actual database credentials from Step 3

4. **Plan**: Free tier
5. Click **Create Web Service**

Render will now:
- Clone your repository
- Install dependencies
- Build the application
- Deploy and start the service
- Give you a live URL (e.g., `nuxbox.onrender.com`)

---

## Step 5: Setup Database Schema

The database is created but empty. You need to run the schema:

### Option A: Using SQL Editor (Easiest)

1. In Render Dashboard, click on your PostgreSQL database
2. Go to **Connect** tab
3. Click **SQL Editor** (or **PostgreSQL Shell**)
4. Copy the entire contents of `database/schema.sql`
5. Paste into the SQL editor
6. Execute

### Option B: Using psql Command

```bash
psql "your-database-url" < database/schema.sql
```

Replace `your-database-url` with the Internal Database URL from Step 3.

---

## Step 6: Verify Deployment

1. Go to your service URL (e.g., `https://nuxbox.onrender.com`)
2. You should see the NuxBox landing page
3. Test features:
   - Browse apps (should work)
   - Try feedback page (should require login)
   - Try report page (should require login)

---

## Automatic Updates

Now whenever you push code to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically:
1. Pull latest code
2. Run build command
3. Deploy new version
4. Restart the service

---

## Managing Your Render Services

### View Logs
- Dashboard → Your service → **Logs** tab
- See real-time application output and errors

### Restart Service
- Dashboard → Your service → **Manual Deploy** → **Deploy latest commit**

### Update Environment Variables
- Dashboard → Your service → **Environment** tab
- Add/edit variables → auto-restarts service

### Database Backups
- Dashboard → PostgreSQL → **Backups** tab
- Render auto-backs up daily

---

## Free Tier Limits & Costs

### Free Web Service:
- 750 hours/month (enough for 1 always-on app)
- Limited compute resources
- Apps spin down after 15 mins of inactivity
- Cold starts take ~30-60 seconds

### Free PostgreSQL:
- 1GB storage
- Auto-expires after 90 days (development only)
- After 90 days, upgrade to keep data

### Upgrade After Free Trial

**Basic Plan (after 90 days):**
- PostgreSQL: **$7/month** (get 90-day renewal)
- Web Service: **$7/month** (removes cold starts)
- Total: ~$14/month

---

## Common Issues & Solutions

### "Application failed to start"

**Check:**
1. Go to **Logs** tab and read the error
2. Verify environment variables are set correctly
3. Ensure `dist/index.cjs` file exists after build
4. Check `npm start` command in package.json

**Fix:**
```bash
# Manually test build locally
npm run build
npm start
```

### "Cannot connect to database"

**Check:**
1. Verify DATABASE_URL in environment variables
2. Ensure database schema was run (tables created)
3. Check database credentials are correct

**Fix:**
1. Go to PostgreSQL in Render
2. Copy the **Internal Database URL** again
3. Update it in Web Service environment variables

### "Module not found" errors

**Check:**
1. Are all dependencies listed in package.json?
2. Did you upload all source files to GitHub?

**Fix:**
```bash
# Add missing dependencies
npm install package-name

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push origin main
```

---

## Next Steps

1. **Add your apps** to the database:
   ```sql
   INSERT INTO apps (name, description, category, version, file_name, file_size, is_active)
   VALUES ('My App', 'Description', 'Category', '1.0.0', 'app.zip', 1000000, true);
   ```

2. **Upload ZIP files** to your downloads folder (via FTP or file manager)

3. **Customize branding** in `design_guidelines.md`

4. **Monitor performance** in Render dashboard

---

## Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Render Documentation**: https://render.com/docs
- **PostgreSQL Browser**: https://render.com/docs/data-persistence#data-browser
- **GitHub Integration**: https://render.com/docs/deploy-from-github

---

## Support

**If something breaks:**
1. Check **Logs** in Render dashboard
2. Check **Events** tab for deployment status
3. Read the error message carefully
4. Try redeploying via **Manual Deploy**

Good luck! 🚀
