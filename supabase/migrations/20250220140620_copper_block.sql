/*
  # Create URLs table and security policies

  1. New Tables
    - `urls`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `original_url` (text)
      - `short_code` (text, unique)
      - `created_at` (timestamp)
      - `visits` (integer)

  2. Security
    - Enable RLS on `urls` table
    - Add policies for:
      - Users can create their own URLs
      - Users can read their own URLs
      - Anyone can access a URL by short code
*/

CREATE TABLE urls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  original_url text NOT NULL,
  short_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  visits integer DEFAULT 0
);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

-- Allow users to create their own URLs
CREATE POLICY "Users can create their own URLs"
  ON urls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own URLs
CREATE POLICY "Users can read their own URLs"
  ON urls
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow public access to URLs by short code
CREATE POLICY "Anyone can access URLs by short code"
  ON urls
  FOR SELECT
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX urls_short_code_idx ON urls (short_code);