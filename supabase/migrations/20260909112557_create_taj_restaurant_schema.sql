/*
# Taj Restaurant — Database Schema

Creates the core tables for the Taj Restaurant website:
- `menu_items`: food items with prices, categories, descriptions, images
- `telugu_movies`: Telugu movie recommendations shown on the site
- `orders`: customer delivery orders (linked to authenticated users)

## 1. menu_items table
- `id` (uuid, primary key)
- `name` (text, not null) — dish name
- `description` (text) — short description of the dish
- `price` (numeric, not null) — price in INR
- `category` (text, not null) — e.g. Starters, Main Course, Biryani, Desserts, Beverages
- `image_url` (text) — optional image URL
- `is_veg` (boolean, default true) — vegetarian flag
- `is_featured` (boolean, default false) — show on home page
- `is_available` (boolean, default true) — currently available
- `created_at` (timestamptz)

## 2. telugu_movies table
- `id` (uuid, primary key)
- `title` (text, not null) — movie title
- `year` (int) — release year
- `director` (text)
- `genre` (text)
- `rating` (numeric) — out of 10
- `description` (text) — short description / why recommended
- `poster_url` (text) — optional poster image URL
- `is_recommended` (boolean, default true)
- `created_at` (timestamptz)

## 3. orders table (multi-user, owner-scoped)
- `id` (uuid, primary key)
- `user_id` (uuid, not null, defaults to auth.uid(), FK to auth.users)
- `items` (jsonb, not null) — array of { name, price, quantity }
- `total` (numeric, not null) — total order value
- `status` (text, default 'pending') — pending, preparing, out_for_delivery, delivered
- `delivery_address` (text, not null)
- `delivery_phone` (text, not null)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- menu_items: public read (anon + authenticated), no public writes.
- telugu_movies: public read (anon + authenticated), no public writes.
- orders: owner-scoped CRUD (authenticated users only manage their own orders).
*/

-- Menu items (public read)
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  image_url text,
  is_veg boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

-- Telugu movies (public read)
CREATE TABLE IF NOT EXISTS telugu_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  year int,
  director text,
  genre text,
  rating numeric(3, 1),
  description text,
  poster_url text,
  is_recommended boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE telugu_movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_telugu_movies" ON telugu_movies;
CREATE POLICY "public_read_telugu_movies" ON telugu_movies FOR SELECT
  TO anon, authenticated USING (true);

-- Orders (owner-scoped)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  delivery_address text NOT NULL,
  delivery_phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_orders" ON orders;
CREATE POLICY "delete_own_orders" ON orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
