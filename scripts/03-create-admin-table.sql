-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to admin_users" ON admin_users FOR ALL USING (true);

-- Insert default admin user (password: admin123)
-- In production, use proper password hashing
INSERT INTO admin_users (username, password_hash, full_name) VALUES 
('admin', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu', 'Teh Imas'),
('tehimas', 'tehimas123', 'Teh Imas Admin')
ON CONFLICT (username) DO NOTHING;
