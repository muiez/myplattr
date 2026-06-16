-- Demo seed: 3 fake auth users + profiles + recipes + tags
-- Safe to re-run (ON CONFLICT DO NOTHING everywhere)

INSERT INTO auth.users (id, aud, role, email, encrypted_password, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'sarah@demo.myplattr.com',  '', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'marcus@demo.myplattr.com', '', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'aisha@demo.myplattr.com',  '', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, username, full_name, avatar_url, xp_points, streak, is_verified, plan)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'sarahcooks',  'Sarah Chen',    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face', 0, 0, false, 'free'),
  ('00000000-0000-0000-0000-000000000002', 'marcuseats',  'Marcus Rivera', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face', 0, 0, false, 'free'),
  ('00000000-0000-0000-0000-000000000003', 'aishaplate',  'Aisha Patel',   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face', 0, 0, false, 'free')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recipes (id, author_id, title, description, thumbnail_url, difficulty, prep_time_minutes, serves, rating, likes_count, comments_count, saves_count, is_published, is_ai_generated, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Mediterranean Chicken with Sun-Dried Tomatoes',
    'A nutritious and colorful bowl packed with Mediterranean flavors, perfect for meal prep or a quick dinner.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=480&fit=crop',
    'Easy', 25, 4, 4.8, 342, 44, 128, true, false,
    now() - interval '2 hours', now()
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Authentic Homemade Gnocchi',
    'Light, pillowy gnocchi made from scratch — just potatoes, flour, and love. Serve with your favorite sauce.',
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=480&fit=crop',
    'Medium', 40, 6, 4.9, 891, 112, 445, true, false,
    now() - interval '5 hours', now()
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Vegan Buddha Bowl with Tahini Dressing',
    'A rainbow of roasted veggies, crispy chickpeas, and creamy tahini — nourishing and absolutely stunning.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=480&fit=crop',
    'Easy', 30, 2, 4.7, 567, 78, 312, true, false,
    now() - interval '24 hours', now()
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.recipe_tags (recipe_id, tag)
VALUES
  ('00000000-0000-0000-0001-000000000001', 'Mediterranean'),
  ('00000000-0000-0000-0001-000000000001', 'Chicken'),
  ('00000000-0000-0000-0001-000000000001', 'Healthy'),
  ('00000000-0000-0000-0001-000000000002', 'Italian'),
  ('00000000-0000-0000-0001-000000000002', 'Pasta'),
  ('00000000-0000-0000-0001-000000000002', 'Vegetarian'),
  ('00000000-0000-0000-0001-000000000003', 'Vegan'),
  ('00000000-0000-0000-0001-000000000003', 'Bowl'),
  ('00000000-0000-0000-0001-000000000003', 'Gluten-Free')
ON CONFLICT DO NOTHING;
