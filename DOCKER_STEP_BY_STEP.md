# Docker Deployment - Complete Step By Step Guide

Follow these exact steps. Don't skip any.

---

## STEP 1: Download Your Project from Replit

1. In Replit, look at the left sidebar → file explorer
2. Right-click on the **workspace** folder
3. Click **"Download folder"**
4. Wait for download to complete (you'll get a ZIP file)
5. Extract the ZIP file on your computer

You now have a folder called `workspace` with your complete project.

---

## STEP 2: Create GitHub Repository

### 2A: Create GitHub Account (if you don't have one)
1. Go to **https://github.com**
2. Click **Sign Up**
3. Fill in email, password, username
4. Follow the verification steps

### 2B: Create New Repository
1. Log in to GitHub
2. Click **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name**: `nuxbox`
   - **Description**: `NuxBox - Free Linux Apps Platform`
   - **Public** (must be public for free Render deployment)
   - Check **Add a README file**
4. Click **Create repository**

### 2C: Upload Your Project Files
1. In your new GitHub repository, click **Add file** → **Upload files**
2. Drag and drop your `workspace` folder contents
   - Upload ALL files (server, client, shared, database, Dockerfile, package.json, etc.)
   - Don't upload `node_modules` folder
3. At the bottom, type: `Initial commit`
4. Click **Commit changes**

Now your GitHub repo has all your NuxBox code ready.

---

## STEP 3: Create Render Account

1. Go to **https://render.com**
2. Click **Sign Up** (or **Get Started for Free**)
3. Choose: **Sign up with GitHub** (easier)
4. Click **Authorize render-oss** to connect your GitHub account
5. You're now logged into Render

---

## STEP 4: Create PostgreSQL Database (Do This FIRST!)

Before creating the app, create the database:

1. In Render dashboard, click **New** (top button)
2. Select **PostgreSQL** (not Web Service, not Static Site)
3. Fill in:
   - **Name**: `nuxbox-db`
   - **Database**: `nuxbox`
   - **User**: `nuxbox_user`
   - **Password**: (auto-generated) - copy and save this
   - **Region**: Pick closest to you
   - **Plan**: **Free** (this is important!)
4. Click **Create Database**
5. Wait 2-3 minutes for database to be ready
6. When ready, click on the database
7. Go to **Connect** tab
8. Copy the **Internal Database URL** (looks like: `postgresql://nuxbox_user:password@dpg-xyz.xyz:5432/nuxbox_db`)
9. Save this URL - you'll need it soon

---

## STEP 5: Setup Database Schema

Your database is empty. You need to add the table structure:

1. In Render dashboard, go to your PostgreSQL database
2. Click **SQL Editor** or **Query Editor**
3. Open the file `database/schema.sql` from your project
4. Copy ALL the contents
5. Paste into Render's SQL editor
6. Click **Execute** or **Run**

Wait for it to finish. Now your database has all tables created!

---

## STEP 6: Create Web Service (Your App)

1. In Render dashboard, click **New** (top)
2. Select **Web Service** (NOT PostgreSQL, NOT Static Site)
3. At the top, it will ask: **"Where is your code?"**
4. Select your GitHub repository (`nuxbox`)
5. Click **Connect**
6. Fill in the form:

   | Field | Value |
   |-------|-------|
   | **Name** | `nuxbox` |
   | **Runtime** | **Docker** (IMPORTANT! Select Docker, not Node) |
   | **Build Command** | Leave empty (Docker will use Dockerfile) |
   | **Start Command** | Leave empty (Docker will use Dockerfile) |
   | **Region** | Choose closest to you |
   | **Branch** | `main` |
   | **Plan** | **Free** |

7. Click **Advanced** (bottom)
8. Click **Add Environment Variable** and add these:

   ```
   Key: DATABASE_URL
   Value: [paste the URL you copied in STEP 5]
   
   Key: SESSION_SECRET
   Value: [generate random string - example: aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV]
   
   Key: NODE_ENV
   Value: production
   ```

   To generate random SESSION_SECRET, you can use: `openssl rand -base64 32`

9. Click **Create Web Service**

Render will now:
- Pull your code from GitHub
- Read the Dockerfile
- Build Docker image
- Deploy your app
- Give you a URL like: `nuxbox.onrender.com`

This takes 5-10 minutes. You can watch the build in real-time!

---

## STEP 7: Wait for Deployment

1. Render dashboard shows a **Build** progress
2. Watch the logs in real-time
3. When it says **"Your service is live 🎉"** - it's done!
4. You'll see your public URL at the top (e.g., `https://nuxbox.onrender.com`)

---

## STEP 8: Test Your App

1. Click the URL from Render (or copy-paste it)
2. Visit your live app
3. Test features:
   - ✅ See the NuxBox landing page
   - ✅ Click "Browse Apps" - should show app list
   - ✅ Click "Feedback" - should show login page (not logged in)
   - ✅ Click "Report" - should show login page

If you see these - **congratulations! Your app is live!** 🎉

---

## STEP 9: Add Sample Apps (Optional)

To add apps to your database:

1. In Render dashboard, go to your PostgreSQL database
2. Click **SQL Editor**
3. Run this SQL:

```sql
INSERT INTO apps (name, description, category, version, file_name, file_size, icon_url, download_count, is_active)
VALUES
  ('VLC Media Player', 'Free media player for Linux', 'Multimedia', '3.0.20', 'vlc.zip', 5242880, 'https://via.placeholder.com/128', 100, true),
  ('GIMP', 'Free image editor', 'Graphics', '2.10.36', 'gimp.zip', 12582912, 'https://via.placeholder.com/128', 50, true),
  ('Blender', '3D modeling software', 'Graphics', '4.1.1', 'blender.zip', 314572800, 'https://via.placeholder.com/128', 30, true);
```

Now apps will show in your app!

---

## STEP 10: Update Your App (In Future)

Whenever you make changes:

1. Edit files locally on your computer
2. Push to GitHub:
   ```bash
   git add -A
   git commit -m "Your changes"
   git push origin main
   ```
3. Render automatically rebuilds and deploys!

---

## ✅ Complete Checklist

- [ ] Step 1: Downloaded project from Replit
- [ ] Step 2: Created GitHub repository and uploaded files
- [ ] Step 3: Created Render account
- [ ] Step 4: Created PostgreSQL database on Render
- [ ] Step 5: Ran database schema.sql
- [ ] Step 6: Created Web Service with Docker runtime
- [ ] Step 7: Waited for deployment to complete
- [ ] Step 8: Tested app - saw landing page
- [ ] Step 9 (Optional): Added sample apps to database
- [ ] Step 10: Ready to update app in future

---

## 🎯 You're Done!

Your NuxBox app is now live on the internet! 

**Your URL**: `https://nuxbox.onrender.com`

Share this URL with anyone and they can access your app!

---

## Troubleshooting

### "Build failed"
- Check the Render logs (dashboard → Events tab)
- Look for error messages
- Common issue: Missing database.sql file

### "No process listening on port 3000"
- Check logs
- Verify Dockerfile exists
- Verify package.json has `npm start` script

### "Cannot connect to database"
- Verify DATABASE_URL environment variable is set correctly
- Check that schema.sql was executed
- Go to PostgreSQL database → check tables exist

### "Page shows 404"
- Service might still be starting (cold start can take 30s)
- Try refreshing page
- Check logs for errors

---

## Next Steps

1. **Upload app files**: Put your Linux app ZIP files in the `downloads` folder
2. **Add to database**: Insert app records into the `apps` table
3. **Customize branding**: Update logo, colors in design_guidelines.md
4. **Monitor logs**: Check Render dashboard regularly

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com
- **Check Render Logs**: Dashboard → Your service → Logs tab

Good luck! 🚀
