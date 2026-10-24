-- ==============================================================================
-- Doodhwala Secure Administrator Bootstrap Procedure
-- ==============================================================================
-- SECURITY NOTICE:
-- Public customer signups intentionally default to role = 'customer'.
-- Direct updates to the 'role' column from frontend clients are blocked by RLS policies.
-- 
-- TO BOOTSTRAP YOUR FIRST ADMINISTRATOR:
-- 1. Sign up a new user via the Doodhwala web application or Supabase Auth dashboard.
-- 2. Open the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql).
-- 3. Run the query below with your registered owner email address.
-- ==============================================================================

-- STEP 1: Verify the registered user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@yourdairy.local'; -- Replace with your actual email

-- STEP 2: Elevate the user profile to 'admin'
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@yourdairy.local'; -- Replace with your actual email

-- STEP 3: Verify the promotion
SELECT p.id, p.name, p.email, p.phone, p.role 
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- ==============================================================================
-- AUDIT TRAIL LOGGING
-- ==============================================================================
-- Optional: Verify that non-admin accounts cannot access admin endpoints
-- SELECT is_admin('your-user-uuid-here');
