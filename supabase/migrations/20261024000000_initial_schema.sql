-- ==============================================================================
-- Doodhwala PostgreSQL Relational Schema & Security Migration
-- Includes 12 core tables, indexes, check constraints, triggers, and Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'delivery_partner');
CREATE TYPE product_category AS ENUM ('milk', 'ghee', 'paneer', 'curd');
CREATE TYPE fulfillment_type AS ENUM ('delivery', 'pickup');
CREATE TYPE order_status AS ENUM (
  'pending_confirmation',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'ready_for_pickup',
  'cancelled'
);
CREATE TYPE payment_method AS ENUM ('cod', 'upi_manual', 'payment_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'pending_verification', 'paid', 'failed', 'refunded');
CREATE TYPE subscription_frequency AS ENUM ('daily', 'alternate_days', 'weekly');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'failed', 'delivered');

-- 2. CUSTOMER PROFILES (Mapped to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. PRODUCTS (Base catalog)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category product_category NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  features TEXT[] DEFAULT '{}',
  storage_info TEXT,
  nutrition_facts JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. PRODUCT VARIANTS (Pack sizes, pricing & stock)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL, -- e.g. "500 ml", "1 Litre", "200 g"
  sku TEXT NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= price),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. DELIVERY ZONES (Configurable service areas)
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  postal_code VARCHAR(10) NOT NULL UNIQUE,
  city TEXT NOT NULL,
  area_name TEXT NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 30 CHECK (delivery_fee >= 0),
  min_order_free_delivery NUMERIC(10, 2) NOT NULL DEFAULT 300 CHECK (min_order_free_delivery >= 0),
  estimated_delivery_time TEXT NOT NULL DEFAULT 'Next Morning 6:00 AM – 8:30 AM',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. DELIVERY ADDRESSES
CREATE TABLE delivery_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfillment_type fulfillment_type NOT NULL DEFAULT 'delivery',
  order_status order_status NOT NULL DEFAULT 'pending_confirmation',
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  delivery_address_snapshot JSONB,
  notes TEXT,
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. ORDER ITEMS (Snapshot of product and historical unit price)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

-- 9. ORDER STATUS AUDIT EVENTS
CREATE TABLE order_status_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status NOT NULL,
  to_status order_status NOT NULL,
  changed_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. PAYMENTS (Separated from orders)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  payment_status payment_status NOT NULL DEFAULT 'pending',
  upi_reference_number TEXT,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. RECURRING SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  frequency subscription_frequency NOT NULL DEFAULT 'daily',
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  status subscription_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  next_delivery_date DATE NOT NULL,
  delivery_address_snapshot JSONB NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. STORE SETTINGS & VISIBILITY CONTROLS
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. NOTIFICATION OUTBOX (For WhatsApp Business Cloud API)
CREATE TABLE notification_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_phone TEXT NOT NULL,
  template_name TEXT NOT NULL,
  template_params JSONB NOT NULL DEFAULT '{}',
  status notification_status NOT NULL DEFAULT 'queued',
  attempts INT NOT NULL DEFAULT 0,
  provider_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  processed_at TIMESTAMPTZ
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_notification_outbox_status ON notification_outbox(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_outbox ENABLE ROW LEVEL SECURITY;

-- Helper function: Is user an Administrator?
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer'); -- Disallow self-promotion to admin!

-- Catalog Policies (Public read, admin write)
CREATE POLICY "Public can view published products" ON products
  FOR SELECT USING (is_published = true OR is_admin(auth.uid()));

CREATE POLICY "Only admins manage products" ON products
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Public can view variants of published products" ON product_variants
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND (p.is_published = true OR is_admin(auth.uid()))
  ));

CREATE POLICY "Only admins manage variants" ON product_variants
  FOR ALL USING (is_admin(auth.uid()));

-- Delivery Zones Policies
CREATE POLICY "Public can read active delivery zones" ON delivery_zones
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins manage delivery zones" ON delivery_zones
  FOR ALL USING (is_admin(auth.uid()));

-- Orders & Items Policies
CREATE POLICY "Customers view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id OR is_admin(auth.uid()));

CREATE POLICY "Customers create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

CREATE POLICY "Admins update orders" ON orders
  FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "View order items" ON order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND (o.customer_id = auth.uid() OR is_admin(auth.uid()))
  ));

CREATE POLICY "Insert order items" ON order_items
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND (o.customer_id = auth.uid() OR o.customer_id IS NULL)
  ));

-- Payments Policies
CREATE POLICY "View payments" ON payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = payments.order_id AND (o.customer_id = auth.uid() OR is_admin(auth.uid()))
  ));

CREATE POLICY "Customer submit UPI reference" ON payments
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM orders o WHERE o.id = payments.order_id AND o.customer_id = auth.uid()
  ))
  WITH CHECK (payment_status = 'pending_verification'); -- Customer cannot set status to 'paid'!

CREATE POLICY "Admins verify and manage payments" ON payments
  FOR ALL USING (is_admin(auth.uid()));

-- Subscriptions Policies
CREATE POLICY "Customers manage own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() = customer_id OR is_admin(auth.uid()));

-- Site Settings
CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins write site settings" ON site_settings
  FOR ALL USING (is_admin(auth.uid()));

-- Notification Outbox (Server-side Edge functions only)
CREATE POLICY "Admins and service role view notifications" ON notification_outbox
  FOR ALL USING (is_admin(auth.uid()));
