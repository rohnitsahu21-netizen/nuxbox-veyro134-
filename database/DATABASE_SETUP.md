# NuxBox Database Setup Guide for Hostinger

This guide will help you set up the PostgreSQL database for NuxBox on Hostinger.

## Prerequisites
- Hostinger hosting account with PostgreSQL database support
- Access to Hostinger's database management panel (cPanel or similar)
- PostgreSQL client installed (optional, for local testing)

## Step 1: Create a PostgreSQL Database on Hostinger

1. Log in to your Hostinger account
2. Go to **Databases** or **cPanel** → **MySQL/PostgreSQL Databases**
3. Create a new PostgreSQL database with these details:
   - **Database Name**: `nuxbox_db` (or your preferred name)
   - **Username**: Create a new database user (e.g., `nuxbox_user`)
   - **Password**: Use a strong password (save this for later)
   - **Privileges**: Grant all privileges to the user

4. Note down:
   - Database name
   - Database username
   - Database password
   - Database host (usually provided by Hostinger, e.g., `db.hostinger.com`)
   - Database port (default: 5432)

## Step 2: Run the SQL Schema

You have three options to run the schema:

### Option A: Using Hostinger's phpPgAdmin or Database Manager
1. Go to **Databases** in your Hostinger panel
2. Click on your PostgreSQL database
3. Look for "phpPgAdmin" or similar database management tool
4. Open the SQL query console
5. Copy the entire contents of `database/schema.sql`
6. Paste it into the query console
7. Execute the query

### Option B: Using psql Command Line (if you have PostgreSQL installed locally)
```bash
psql -h <host> -U <username> -d <database_name> -f database/schema.sql
```

Replace:
- `<host>` - Your Hostinger database host
- `<username>` - Your database username
- `<database_name>` - Your database name

### Option C: Using a Database GUI Tool
Use tools like:
- **pgAdmin 4** (https://www.pgadmin.org/)
- **DBeaver** (https://dbeaver.io/)

1. Create a new connection with your Hostinger database credentials
2. Connect to your database
3. Open `database/schema.sql` as a script
4. Execute it

## Step 3: (Optional) Load Sample Data

If you want to test with sample data:

1. Follow the same process as Step 2, but use `database/sample-data.sql`
2. This will populate sample apps for testing

## Step 4: Configure Your Application

Create a `.env` file in your project root with these variables:

```env
# Database Configuration
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
PGHOST=<host>
PGPORT=<port>
PGUSER=<username>
PGPASSWORD=<password>
PGDATABASE=<database_name>

# Session Secret
SESSION_SECRET=your-random-secret-key-here

# Application
NODE_ENV=production
PORT=3000

# Replit Auth (if using Replit Auth, otherwise can be empty)
REPL_ID=your-replit-id
```

**Example:**
```env
DATABASE_URL=postgresql://nuxbox_user:MyPassword123@db.hostinger.com:5432/nuxbox_db
PGHOST=db.hostinger.com
PGPORT=5432
PGUSER=nuxbox_user
PGPASSWORD=MyPassword123
PGDATABASE=nuxbox_db
SESSION_SECRET=asdfghjklzxcvbnm1234567890
NODE_ENV=production
PORT=3000
```

## Step 5: Deploy on Hostinger

1. Upload your project to Hostinger (via FTP, Git, or Hostinger's file manager)
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the application
4. Set your Node.js application to start with: `npm start`
5. Your app will now connect to your PostgreSQL database

## Database Tables

The schema creates these tables:

### users
Stores user account information
- `id` - Unique identifier
- `email` - User email
- `first_name`, `last_name` - User names
- `profile_image_url` - Avatar/profile picture URL
- `is_admin` - Admin flag
- `created_at`, `updated_at` - Timestamps

### apps
Stores Linux applications/tools
- `id` - Unique identifier
- `name` - Application name
- `description` - Detailed description
- `category` - App category
- `version` - Version number
- `file_name` - ZIP filename
- `file_size` - File size in bytes
- `icon_url` - Icon image URL
- `download_count` - Total downloads
- `is_active` - Active/inactive status
- `created_at`, `updated_at` - Timestamps

### feedback
Stores user feedback submissions
- `id` - Unique identifier
- `user_id` - Reference to user
- `subject` - Feedback subject
- `message` - Feedback message
- `rating` - Optional rating (1-5 stars)
- `status` - 'pending', 'resolved', etc.
- `created_at` - Submission timestamp

### reports
Stores problem reports for apps
- `id` - Unique identifier
- `user_id` - Reporter user
- `app_id` - Reported app
- `issue_type` - Type of issue
- `description` - Detailed description
- `status` - 'open', 'closed', etc.
- `created_at` - Report timestamp

### downloads
Tracks user downloads
- `id` - Unique identifier
- `user_id` - Downloading user
- `app_id` - Downloaded app
- `downloaded_at` - Download timestamp

### sessions
Stores session data (auto-managed)
- `sid` - Session ID
- `sess` - Session data (JSON)
- `expire` - Session expiration timestamp

## Troubleshooting

### Connection Error: "connect ECONNREFUSED"
- Check your DATABASE_URL is correct
- Verify your database credentials
- Ensure Hostinger has PostgreSQL database created
- Check that your IP is whitelisted (if using IP restrictions)

### Table Already Exists Error
- This is fine if running the schema multiple times
- The schema uses `CREATE TABLE IF NOT EXISTS` to prevent errors

### Permission Denied Error
- Ensure your database user has proper privileges
- Regenerate the database user with full privileges from Hostinger panel

## Backup Your Database

Before deploying to production, it's good practice to backup:

```bash
pg_dump -h <host> -U <username> <database_name> > backup.sql
```

This creates a backup file you can restore later if needed.

## Need Help?

- Hostinger Support: https://support.hostinger.com/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- NuxBox GitHub: [Your repo link]
