-- Drop only the users table
DROP TABLE IF EXISTS users;

-- Create users table with all necessary columns
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or replace the function to limit to 3 users
CREATE OR REPLACE FUNCTION user_login_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) >= 3 THEN
    RAISE EXCEPTION 'Maximum number of users reached';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remove old trigger if it exists
DROP TRIGGER IF EXISTS check_user_limit ON users;

-- Add the trigger to enforce user limit
CREATE TRIGGER check_user_limit
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION user_login_limit();
