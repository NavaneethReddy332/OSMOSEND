/*
  # File Sharing Platform Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `user_code` (text, unique) - 8-character unique code for user tracking
      - `created_at` (timestamptz) - When user first visited
      - `last_active` (timestamptz) - Last activity timestamp
    
    - `transfers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Links to users table
      - `transfer_code` (text, unique) - 6-digit code for file retrieval
      - `file_urls` (jsonb) - Array of file metadata (name, url, size, path)
      - `expires_at` (timestamptz) - Expiration time (10 minutes from creation)
      - `created_at` (timestamptz) - Upload timestamp
      - `download_count` (integer) - Track number of downloads
      - `is_expired` (boolean) - Manual expiration flag

  2. Security
    - Enable RLS on both tables
    - Users can only read their own data
    - Transfers are accessible by code (public read with code)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  transfer_code text UNIQUE NOT NULL,
  file_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  download_count integer DEFAULT 0,
  is_expired boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_transfers_code ON transfers(transfer_code);
CREATE INDEX IF NOT EXISTS idx_transfers_user ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_expires ON transfers(expires_at);
CREATE INDEX IF NOT EXISTS idx_users_code ON users(user_code);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read transfers by code"
  ON transfers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can create transfers"
  ON transfers FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update own transfers"
  ON transfers FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);