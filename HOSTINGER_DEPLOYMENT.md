# NuxBox - Hostinger Deployment Guide

Complete guide to deploy NuxBox on Hostinger's Node.js hosting.

## Quick Start

1. **Setup Database** - Follow `database/DATABASE_SETUP.md`
2. **Upload Project** - Upload all files to Hostinger
3. **Install Dependencies** - Run `npm install`
4. **Configure Environment** - Create `.env` file
5. **Build Application** - Run `npm run build`
6. **Start Application** - Set startup script to `npm start`

---

## Detailed Steps

### 1. Prepare Your Project

```bash
# Download your project from Replit
# Extract the nuxbox-website.tar.gz file

# Navigate to project directory
cd nuxbox

# Install dependencies locally (optional, for testing)
npm install

# Build for production
npm run build
```

### 2. Set Up PostgreSQL Database on Hostinger

See `database/DATABASE_SETUP.md` for detailed database setup instructions.

**Quick Summary:**
1. Create PostgreSQL database in Hostinger panel
2. Run `database/schema.sql` using phpPgAdmin or similar tool
3. Note your database credentials

### 3. Upload to Hostinger

#### Via File Manager:
1. Login to Hostinger
2. Go to File Manager
3. Upload entire project to your hosting root (usually `public_html` or similar)
4. Ensure Node.js is enabled in your hosting settings

#### Via FTP:
1. Get FTP credentials from Hostinger
2. Use FTP client (FileZilla, WinSCP, etc.)
3. Connect and upload project files
4. Ensure these files are uploaded:
   - `package.json`
   - `package-lock.json`
   - `server/` folder
   - `client/` folder
   - `shared/` folder
   - `dist/` folder (after building)

#### Via Git (if Hostinger supports it):
```bash
# On Hostinger, clone your repository
git clone <your-repository-url>
cd nuxbox
npm install
npm run build
```

### 4. Create Environment File

On Hostinger, create `.env` file in your project root with:

```env
DATABASE_URL=postgresql://nuxbox_user:password@db.hostinger.com:5432/nuxbox_db
PGHOST=db.hostinger.com
PGPORT=5432
PGUSER=nuxbox_user
PGPASSWORD=your-db-password
PGDATABASE=nuxbox_db
SESSION_SECRET=generate-random-string-32-chars-long
NODE_ENV=production
PORT=3000
```

**Tips:**
- Generate a random SESSION_SECRET: `openssl rand -base64 32`
- Keep `.env` file private (never commit to git)
- Use strong database passwords

### 5. Configure Node.js Application

In Hostinger panel:

1. Go to **Node.js Applications** or **App Manager**
2. Create new Node.js application with:
   - **Application Root**: `/home/your-user/public_html/nuxbox`
   - **Application URL**: `yourdomain.com`
   - **Startup File**: `dist/index.cjs`
   - **Node.js Version**: 18 or higher
   - **Port**: 3000
3. Set environment variables (upload `.env` or set via panel)
4. Click **Install Dependencies** to run `npm install`
5. Click **Start/Restart** application

### 6. Verify Installation

Check these files exist:
```
nuxbox/
├── dist/
│   ├── public/          # Frontend React files
│   ├── index.cjs        # Compiled server (entry point)
│   └── ...
├── server/
├── client/
├── package.json
├── .env                 # Environment variables
└── ...
```

### 7. Test the Application

1. Visit `yourdomain.com` in your browser
2. You should see NuxBox landing page
3. Test features:
   - Browse apps (no login required)
   - Try clicking feedback button (should require login)
   - Try report button (should require login)

---

## Project Structure for Hostinger

```
nuxbox/
├── server/                    # Backend Express server
│   ├── index.ts              # Main server entry
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Database operations
│   ├── db.ts                 # Database connection
│   ├── replitAuth.ts         # Authentication
│   ├── static.ts             # Static file serving
│   └── vite.ts               # Vite dev server (dev only)
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   └── index.html            # HTML entry point
│
├── shared/
│   └── schema.ts             # Database schemas & types
│
├── database/
│   ├── schema.sql            # Database schema (run on Hostinger)
│   ├── sample-data.sql       # Sample data (optional)
│   └── DATABASE_SETUP.md     # Database setup guide
│
├── dist/                     # Built output (created by npm run build)
│   ├── public/               # Frontend (served as static files)
│   └── index.cjs             # Compiled server (entry point)
│
├── .env                      # Environment variables (create on Hostinger)
├── .env.example              # Environment template
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite build config
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
└── ...
```

---

## Troubleshooting

### Application Won't Start

**Error: "Cannot find module 'dist/index.cjs'"**
- Run `npm run build` to compile the application
- Ensure `dist/` folder exists
- Check startup file is set to `dist/index.cjs`

**Error: "ENOENT: no such file or directory"**
- Ensure all files are uploaded
- Check file permissions (should be readable)
- Verify `downloads/` folder exists (create if missing)

### Database Connection Issues

**Error: "connect ECONNREFUSED"**
- Verify DATABASE_URL in `.env`
- Check database credentials are correct
- Ensure Hostinger PostgreSQL database exists
- Test connection with psql:
  ```bash
  psql -h <host> -U <username> -d <database> -c "SELECT 1"
  ```

**Error: "relation does not exist"**
- Run database schema: `database/schema.sql`
- Ensure tables are created in database
- Verify database name in DATABASE_URL matches

### Application Crashes

**Check Logs:**
1. Go to Node.js Applications in Hostinger
2. Click on your app
3. View **Error Logs** or **Access Logs**
4. Common issues:
   - Missing environment variables
   - Database connection failed
   - Port already in use

### White Page / No Content

- Check browser console for errors (F12)
- Verify frontend files built correctly:
  - Should have files in `dist/public/`
  - Try visiting `yourdomain.com/index.html`
- Clear browser cache: Ctrl+Shift+Delete

---

## Performance Optimization

### Enable Gzip Compression
Most Hostinger plans support this automatically. Check your .htaccess or nginx config.

### Database Indexing
The schema.sql includes indexes for:
- `users.email`
- `apps.category`, `apps.is_active`
- `feedback.user_id`, `feedback.status`
- `reports.user_id`, `reports.app_id`, `reports.status`
- `downloads.user_id`, `downloads.app_id`

These improve query performance for common operations.

### Caching
Add caching headers in your Hostinger control panel or modify `server/static.ts`.

---

## Environment Variables Checklist

- [ ] DATABASE_URL configured
- [ ] PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE set
- [ ] SESSION_SECRET generated (32+ chars)
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] .env file is NOT committed to git
- [ ] .env file is uploaded to Hostinger

---

## Useful Commands

```bash
# Build application
npm run build

# Start application
npm start

# Check TypeScript errors
npm run check

# Push database schema changes (local development)
npm run db:push

# List all npm scripts available
npm run
```

---

## Getting Help

1. **Hostinger Support**: https://support.hostinger.com/
2. **Node.js Docs**: https://nodejs.org/en/docs/
3. **PostgreSQL Docs**: https://www.postgresql.org/docs/
4. **Express.js Docs**: https://expressjs.com/

---

## Security Checklist

- [ ] Use strong database password
- [ ] Use random SESSION_SECRET
- [ ] Keep `.env` file private
- [ ] Use HTTPS (Hostinger usually provides free SSL)
- [ ] Regular database backups
- [ ] Update Node.js to latest LTS version
- [ ] Monitor error logs regularly

---

## Next Steps

After deployment:

1. **Add Your Apps**: Upload app ZIP files to `downloads/` folder
2. **Add to Database**: Insert app records in `apps` table
3. **Customize Branding**: Update logo and colors in design_guidelines.md
4. **Monitor Performance**: Check logs regularly in Hostinger panel
5. **Set Up Backups**: Schedule automated database backups

Good luck! 🚀
