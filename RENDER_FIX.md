# Fix: "Unsupported Framework" Error on Render

Your project is being rejected by Render because it doesn't automatically recognize the complex TypeScript/Express setup.

## ✅ Solution: Explicit Configuration Files

I've created `render.yaml` to tell Render exactly how to handle your project. Follow these steps:

---

## Step 1: Update Your package.json Manually

⚠️ **You need to edit your `package.json` file** and make these changes:

**Find this section:**
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
```

**Change to:**
```json
{
  "name": "nuxbox",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.cjs",
  "engines": {
    "node": ">=18.0.0"
  },
  "license": "MIT",
```

**Save the file.**

---

## Step 2: Push to GitHub

```bash
git add package.json render.yaml
git commit -m "Add Render configuration"
git push origin main
```

---

## Step 3: Deploy on Render

1. Go to **https://render.com/dashboard**
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `nuxbox`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Runtime**: `Node` (should auto-detect)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Click **Advanced** and add Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   PGHOST=...
   PGPORT=5432
   PGUSER=...
   PGPASSWORD=...
   PGDATABASE=...
   SESSION_SECRET=random-string-32-chars
   NODE_ENV=production
   ```

6. **Plan**: Free
7. Click **Create Web Service**

---

## What If It Still Says Unsupported?

If you see "Unsupported framework" error after following above steps:

### Solution A: Create `.node-version` File

Create a file named `.node-version` in your project root:
```
18.19.0
```

Push to GitHub:
```bash
git add .node-version
git commit -m "Add Node version"
git push origin main
```

---

### Solution B: Check `render.yaml`

Verify the file exists at project root (I've already created it):
```bash
cat render.yaml
```

Should show:
```yaml
services:
  - type: web
    name: nuxbox
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
```

---

## Still Getting Error? Try This Checklist:

- [ ] `package.json` has `"main": "dist/index.cjs"`
- [ ] `package.json` has `"engines": { "node": ">=18.0.0" }`
- [ ] `render.yaml` exists in root directory
- [ ] GitHub repository is public or authorized
- [ ] All files are pushed to GitHub (`git push`)
- [ ] You're on the `main` branch
- [ ] No `.gitignore` entries blocking important files

---

## Quick Render Deployment Checklist

| Step | Status |
|------|--------|
| 1. Edit `package.json` (add `main` and `engines`) | ⬜ TO DO |
| 2. Push to GitHub | ⬜ TO DO |
| 3. Go to render.com | ⬜ TO DO |
| 4. Create Web Service | ⬜ TO DO |
| 5. Connect GitHub repo | ⬜ TO DO |
| 6. Set environment variables | ⬜ TO DO |
| 7. Deploy | ⬜ TO DO |
| 8. Set up database schema | ⬜ TO DO |
| 9. Test the app | ⬜ TO DO |

---

## Expected Result

After deployment, you should see:
- Build succeeds (shows "Your service is live 🎉")
- App URL provided (e.g., `nuxbox.onrender.com`)
- Landing page loads
- No "Unsupported framework" error

---

## Need More Help?

- **Render Docs**: https://render.com/docs/deploy-node-express-app
- **See detailed guide**: `DEPLOY_TO_RENDER.md`
- **Check logs**: Dashboard → Your service → Logs tab

---

## Last Resort: Alternative Platforms

If Render still doesn't work, try:
- **Railway** (paid, $10-20/mo): Better UI, easier setup - see `DEPLOY_TO_RAILWAY.md`
- **Vercel + Supabase** (free): Requires serverless refactoring
- **Heroku** (paid, $7+/mo): Similar setup to Render

Good luck! 🚀
