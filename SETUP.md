# OSMO File Transfer - Setup Instructions

## Storj Configuration Required

To complete the setup, you need to add your Storj credentials to the `.env` file.

### Steps to Configure Storj:

1. **Get Storj Credentials:**
   - Access Key ID
   - Secret Access Key
   - Bucket Name
   - Endpoint URL (default: `https://gateway.storjshare.io`)

2. **Update the `.env` file:**

Open `/tmp/cc-agent/61680509/project/.env` and replace these placeholders:

```env
VITE_STORJ_ACCESS_KEY=your_actual_access_key_here
VITE_STORJ_SECRET_KEY=your_actual_secret_key_here
VITE_STORJ_BUCKET=your_bucket_name_here
VITE_STORJ_ENDPOINT=https://gateway.storjshare.io
```

## Features Implemented

1. **User Tracking System:**
   - Unique 8-character code generated for each user on first visit
   - Stored in localStorage for persistence
   - Tracks user activity in Supabase database

2. **File Upload:**
   - Drag & drop or click to browse files
   - Multiple file selection
   - Auto-zips multiple files into single archive
   - Uploads to Storj storage

3. **Upload Progress:**
   - Real-time progress bar
   - Upload speed indicator (MB/s)
   - Percentage completion

4. **File Sharing:**
   - 6-digit transfer code generation
   - Shareable link generation
   - QR code for easy mobile sharing
   - 10-minute expiration on all transfers

5. **File Download:**
   - Enter 6-digit code to retrieve files
   - Download tracking (counts downloads)
   - URL parameter support (?code=123456)
   - Expiration validation

6. **Database Features:**
   - User session tracking
   - Transfer history
   - Download analytics
   - Automatic expiration handling

## Database Schema

### Users Table
- `id` (uuid) - Primary key
- `user_code` (text) - 8-char unique identifier
- `created_at` (timestamptz) - First visit timestamp
- `last_active` (timestamptz) - Last activity timestamp

### Transfers Table
- `id` (uuid) - Primary key
- `user_id` (uuid) - Foreign key to users
- `transfer_code` (text) - 6-digit code
- `file_urls` (jsonb) - File metadata array
- `expires_at` (timestamptz) - Expiration time
- `download_count` (integer) - Download tracking
- `is_expired` (boolean) - Manual expiration flag

## Running the Project

After configuring Storj credentials:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Design

The application follows the exact design from the provided HTML file:
- Dark theme with green accents
- Floating pill navigation with expandable menu
- Animated marquee bar
- Side-by-side Send/Receive cards
- Responsive layout
- Smooth transitions and hover effects
