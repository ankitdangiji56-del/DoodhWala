-- ==============================================================================
-- Doodhwala Initial Seed Data
-- Farm-Fresh Milk, Bilona Ghee, Malai Paneer, and Earthen-Pot Curd
-- ==============================================================================

-- 1. Insert Initial Products
INSERT INTO products (id, name, slug, category, description, image_url, is_published, features, storage_info, nutrition_facts)
VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Farm-Fresh Whole Milk',
  'farm-fresh-whole-milk',
  'milk',
  'Unprocessed, pure cow milk delivered straight from trusted local pastures within hours of morning milking. Naturally wholesome with rich cream on top, no synthetic additives or preservatives.',
  '/images/milk.jpg',
  true,
  ARRAY['Delivered within 4–6 hours of milking', 'No added preservatives, skim powder, or adulterants', 'Naturally rich cream content', 'Packed in sanitized glass containers'],
  'Store chilled at 4°C or below. Boil before consumption.',
  '{"Serving Size": "100 ml", "Energy": "66 kcal", "Protein": "3.4 g", "Fat": "4.1 g", "Calcium": "125 mg"}'::jsonb
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Traditional Bilona Cow Ghee',
  'traditional-bilona-cow-ghee',
  'ghee',
  'Handcrafted using the ancient slow-churned Bilona method from curd made with pure cow milk. Cooked over slow flame to achieve a fragrant, golden granular (danedar) texture and deeply comforting aroma.',
  '/images/ghee.jpg',
  true,
  ARRAY['Made from whole curd using traditional Bilona churning', 'Slow-cooked in small artisan batches', 'Rich golden granular (danedar) texture', 'Zero artificial aroma, colors, or trans fats'],
  'Store in a cool, dry place away from direct sunlight. Do not refrigerate.',
  '{"Serving Size": "10 g", "Energy": "89 kcal", "Total Fat": "9.9 g", "Cholesterol": "24 mg"}'::jsonb
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Fresh Malai Paneer',
  'fresh-malai-paneer',
  'paneer',
  'Silky, melt-in-mouth cottage cheese crafted exclusively from high-fat, non-homogenized fresh whole milk curdled gently with lemon juice. Dense, spongy, and packed with bioavailable protein.',
  '/images/paneer.jpg',
  true,
  ARRAY['Natural coagulant (lemon juice), zero vinegar or acid chemicals', 'Moist, spongy texture', 'High natural protein', 'Never frozen; made fresh every morning'],
  'Keep refrigerated in cold water. Change water daily. Consume within 3 days.',
  '{"Serving Size": "100 g", "Energy": "292 kcal", "Protein": "18.3 g", "Fat": "23.1 g", "Calcium": "460 mg"}'::jsonb
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Artisan Natural Set Curd (Dahi)',
  'artisan-natural-set-curd',
  'curd',
  'Thick, velvety, naturally sweet dahi cultured with traditional active probiotics. Free from starch thickeners, gelatin, or industrial stabilizers for soothing gut health.',
  '/images/curd.jpg',
  true,
  ARRAY['Cultured using live heirloom probiotics', 'Naturally thick without added starch', 'Subtle, comforting mildly-tart natural flavor', 'Supports optimal digestion'],
  'Keep refrigerated below 5°C. Consume within 4 days of delivery.',
  '{"Serving Size": "100 g", "Energy": "61 kcal", "Protein": "3.6 g", "Fat": "3.3 g", "Calcium": "140 mg"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Variants
INSERT INTO product_variants (id, product_id, unit_name, sku, price, compare_at_price, stock_quantity, is_available)
VALUES
-- Milk variants
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', '500 ml', 'MILK-W-500', 38.00, 40.00, 45, true),
('b1111111-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', '1 Litre', 'MILK-W-1000', 72.00, 76.00, 60, true),

-- Ghee variants
('b2222222-2222-2222-2222-222222222221', 'a2222222-2222-2222-2222-222222222222', '500 ml', 'GHEE-B-500', 580.00, 640.00, 25, true),
('b2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', '1 Litre', 'GHEE-B-1000', 1100.00, 1250.00, 15, true),

-- Paneer variants
('b3333333-3333-3333-3333-333333333331', 'a3333333-3333-3333-3333-333333333333', '200 g', 'PAN-M-200', 95.00, 105.00, 30, true),
('b3333333-3333-3333-3333-333333333332', 'a3333333-3333-3333-3333-333333333333', '500 g', 'PAN-M-500', 220.00, 240.00, 20, true),
('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', '1 kg', 'PAN-M-1000', 420.00, 460.00, 10, true),

-- Curd variants
('b4444444-4444-4444-4444-444444444441', 'a4444444-4444-4444-4444-444444444444', '400 g (Earthen Pot)', 'CURD-T-400', 65.00, 75.00, 40, true),
('b4444444-4444-4444-4444-444444444442', 'a4444444-4444-4444-4444-444444444444', '1 kg Pack', 'CURD-T-1000', 130.00, 145.00, 25, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Configurable Delivery Zones (Admin can adjust to their launch city)
INSERT INTO delivery_zones (postal_code, city, area_name, delivery_fee, min_order_free_delivery, estimated_delivery_time, is_active)
VALUES
('560001', 'Launch City Zone 1', 'Central Dairy Belt', 25.00, 300.00, 'Next Morning 6:00 AM – 8:00 AM', true),
('560034', 'Launch City Zone 2', 'East Hub Extension', 30.00, 350.00, 'Next Morning 6:30 AM – 8:30 AM', true)
ON CONFLICT (postal_code) DO NOTHING;
