/*
  # DaruratKu Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `icon` (text)
      - `created_at` (timestamp)
    
    - `lost_items`
      - `id` (uuid, primary key) 
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `category_id` (uuid, references categories)
      - `location` (text)
      - `date_lost` (date)
      - `image_url` (text, nullable)
      - `contact_phone` (text)
      - `reward_amount` (integer, nullable)
      - `status` (text, default 'lost')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for lost items to help with searching
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lost_items table
CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  location text NOT NULL,
  date_lost date NOT NULL,
  image_url text,
  contact_phone text NOT NULL,
  reward_amount integer DEFAULT 0,
  status text DEFAULT 'lost' CHECK (status IN ('lost', 'found', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Lost items policies
CREATE POLICY "Lost items are viewable by everyone"
  ON lost_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own lost items"
  ON lost_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lost items"
  ON lost_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lost items"
  ON lost_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
  ('Elektronik', 'Smartphone'),
  ('Dokumen', 'FileText'),
  ('Kendaraan', 'Car'),
  ('Tas & Dompet', 'Wallet'),
  ('Perhiasan', 'Diamond'),
  ('Kunci', 'Key'),
  ('Pakaian', 'Shirt'),
  ('Lainnya', 'Package')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lost_items_updated_at
  BEFORE UPDATE ON lost_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();