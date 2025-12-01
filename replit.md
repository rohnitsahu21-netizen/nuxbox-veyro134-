# NuxBox - Free Linux Apps & Tools Platform

## Project Overview
NuxBox is a modern, dark neon-themed web platform for distributing free Linux applications and tools. Built by Veyro, it features user authentication, app browsing/downloading, feedback submission, and problem reporting.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **File Uploads**: Multer (for zip file uploads)
- **UI Components**: shadcn/ui

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # shadcn components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AppCard.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/           # Utilities
│   │   │   ├── queryClient.ts
│   │   │   ├── authUtils.ts
│   │   │   └── utils.ts
│   │   ├── pages/         # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Browse.tsx
│   │   │   ├── AppDetail.tsx
│   │   │   ├── Feedback.tsx
│   │   │   ├── Report.tsx
│   │   │   ├── Activities.tsx
│   │   │   └── Admin.tsx
│   │   ├── App.tsx        # Main app component
│   │   └── index.css      # Global styles with neon theme
│   └── index.html
├── server/                 # Backend Express server
│   ├── db.ts              # Database connection
│   ├── index.ts           # Server entry
│   ├── replitAuth.ts      # Replit Auth setup
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Vite dev server integration
├── shared/
│   └── schema.ts          # Database schemas & types
├── downloads/             # Uploaded app zip files
└── design_guidelines.md   # Design system documentation
```

## Key Features
1. **User Authentication** - Sign in with Replit Auth (Google, GitHub, etc.)
2. **Browse Apps** - Search, filter by category, sort by popularity/date
3. **Download Apps** - One-click download with tracking
4. **Feedback System** - Submit feedback with ratings
5. **Report Issues** - Report problems with specific apps
6. **User Activities** - Track downloads, feedback, and reports
7. **Admin Panel** - Upload and manage apps (admin users only)

## Database Tables
- `users` - User accounts (synced from Replit Auth)
- `sessions` - Session storage for authentication
- `apps` - Linux applications/tools metadata
- `feedback` - User feedback submissions
- `reports` - Problem reports for apps
- `downloads` - Download tracking

## API Routes
### Public
- `GET /api/apps` - List all active apps
- `GET /api/apps/:id` - Get app details
- `GET /api/apps/:id/download` - Download app file

### Authenticated
- `GET /api/auth/user` - Get current user
- `GET /api/user/stats` - User statistics
- `GET /api/user/downloads` - User's download history
- `GET /api/user/feedback` - User's feedback submissions
- `GET /api/user/reports` - User's problem reports
- `POST /api/downloads` - Record a download
- `POST /api/feedback` - Submit feedback
- `POST /api/reports` - Submit a report

### Admin
- `GET /api/admin/apps` - All apps (including inactive)
- `POST /api/admin/apps` - Upload new app
- `PATCH /api/admin/apps/:id` - Update app
- `DELETE /api/admin/apps/:id` - Delete app

## Design Theme
- **Colors**: Dark neon theme with cyan (#00f0ff), purple (#bf00ff), pink (#ff00aa), green (#00ff88) accents
- **Typography**: Orbitron (headings), Inter (body), JetBrains Mono (code)
- **Animations**: Neon glow effects, smooth transitions, pulse animations

## Development Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push database schema changes

## Logo Placeholder
Place your logo at `client/public/logo.png` (recommended size: 128x128px)

## Admin Access
To make a user an admin, update the `is_admin` column in the `users` table:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

## Deployment Options (2025)

### Recommended Alternatives to Hostinger

**Best FREE Option: Render.com**
- Completely free tier with PostgreSQL database
- Auto-deploys from GitHub (git push = deploy)
- 750 hours/month of compute
- See `DEPLOY_TO_RENDER.md` for setup guide
- Upgrade to $14/month after free trial if needed

**Best PAID Option: Railway.app**
- $10-20/month for small projects
- Excellent developer experience
- Visual project management
- No cold starts like Render
- See `DEPLOY_TO_RAILWAY.md` for setup guide

**Other Free Options: Vercel + Supabase**
- Works only for serverless/API-route backends
- Requires refactoring Express to Vercel Functions
- Free tier: Vercel (unlimited) + Supabase (500MB DB)

See `DEPLOY_ALTERNATIVES.md` for complete comparison table.

### Files Created for Deployment

- `DEPLOY_TO_RENDER.md` - Complete Render setup guide (RECOMMENDED)
- `DEPLOY_TO_RAILWAY.md` - Complete Railway setup guide
- `DEPLOY_ALTERNATIVES.md` - Comparison of all platforms
- `database/schema.sql` - Database schema (run on any PostgreSQL)
- `database/sample-data.sql` - Sample data for testing
- `database/DATABASE_SETUP.md` - Database setup instructions
- `.env.example` - Environment configuration template

### Current Project Status
- ✅ Full-stack ready (React + Express + PostgreSQL)
- ✅ Database schema complete
- ✅ All documentation created
- ✅ Ready to deploy on any Node.js platform
- ✅ NOT compatible with Hostinger shared hosting (needs VPS)
