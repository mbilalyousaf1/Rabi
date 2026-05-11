# Supabase Setup Instructions

To enable automatic notifications and the admin dashboard, follow these steps to set up your Supabase database.

## 1. Create Tables
Go to your **Supabase SQL Editor** and run the following command to create the necessary tables:

```sql
-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Reservations Table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Product Availability Table
CREATE TABLE product_availability (
  product_name TEXT PRIMARY KEY,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Real-time for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE reservations;
```

## 2. Configuration
Copy your API keys into the `.env.local` file I created in your project:

1.  In Supabase, go to **Project Settings** > **API**.
2.  Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`.
3.  Copy the **anon public** key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Also configure owner login protection in `.env.local`:

```env
ADMIN_PANEL_PASSWORD=your-strong-owner-password
ADMIN_SESSION_TOKEN=your-long-random-session-token
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-server-only
```

Then restart your app.

## 3. Secure Database Access (RLS)
To prevent public access to admin data, enable Row Level Security and add restrictive policies.

Run this SQL in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Remove old permissive policies if any exist
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can view orders" ON orders;
DROP POLICY IF EXISTS "Public can update orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous order insert" ON orders;

DROP POLICY IF EXISTS "Public can insert reservations" ON reservations;
DROP POLICY IF EXISTS "Public can view reservations" ON reservations;
DROP POLICY IF EXISTS "Public can update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow anonymous reservation insert" ON reservations;

-- Customer-side creates are allowed (checkout/contact forms use anon key)
CREATE POLICY "Allow anonymous order insert"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous reservation insert"
ON reservations
FOR INSERT
TO anon
WITH CHECK (true);

-- IMPORTANT:
-- Do NOT create anon SELECT/UPDATE policies for orders/reservations.
-- This keeps admin data private from the public client.
```

### Recommended production architecture
For maximum security, move admin reads/updates to server routes that use the Supabase service role key (server-only env var), then call those routes from `/admin`. This avoids exposing any elevated database access in the browser.

## 4. Accessing the Dashboard
Once the keys are added, you can view all incoming orders and reservations at:
`http://localhost:3000/admin`

---

### How it works:
*   **Automatic Notification**: When a customer clicks "Place Order," details are inserted into `orders`.
*   **Owner Login Gate**: `/admin` now requires owner login before showing dashboard content.
*   **Data Privacy with RLS**: Public users can submit orders/reservations, but cannot read/update admin data.
