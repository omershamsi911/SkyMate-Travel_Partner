# Database Setup Guide

## Setting up the database tables for SkyMate

The 404 error you're seeing indicates that the `likes` table doesn't exist in your Supabase database. Follow these steps to set up the required tables:

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section in the left sidebar

### Step 2: Run the Database Setup SQL
1. Copy the contents of the `database-setup.sql` file
2. Paste it into the SQL editor in your Supabase dashboard
3. Click "Run" to execute the SQL commands

### Step 3: Verify Tables Created
After running the SQL, you should see these tables in your "Table Editor":
- `likes` - Stores user likes for photos
- `user_photos` - Stores user uploaded photos (if not already exists)

### Step 4: Check RLS Policies
The SQL also sets up Row Level Security (RLS) policies to ensure:
- Users can only like/unlike photos
- Users can only manage their own photos
- All users can view photos and likes

### Alternative: Manual Table Creation
If you prefer to create tables manually through the UI:

#### Create `likes` table:
- Table name: `likes`
- Columns:
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `user_id` (uuid, references auth.users(id))
  - `photo_id` (uuid, references user_photos(id))
  - `created_at` (timestamptz, default: now())

#### Create `user_photos` table (if not exists):
- Table name: `user_photos`
- Columns:
  - `id` (uuid, primary key, default: gen_random_uuid())
  - `user_id` (uuid, references auth.users(id))
  - `file_path` (text)
  - `description` (text)
  - `location` (text)
  - `tags` (text[])
  - `likes` (integer, default: 0)
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

### Troubleshooting
- If you get permission errors, make sure you're logged in as the project owner
- If tables already exist, the `IF NOT EXISTS` clauses will prevent errors
- The likes service has been updated to handle cases where tables don't exist yet

After setting up the database, the likes functionality should work properly without 404 errors. 