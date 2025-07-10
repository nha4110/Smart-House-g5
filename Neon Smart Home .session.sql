DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function to limit to 3 users
CREATE OR REPLACE FUNCTION user_login_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) >= 3 THEN
    RAISE EXCEPTION 'Maximum number of users reached' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
DROP TRIGGER IF EXISTS check_user_limit ON users;

CREATE TRIGGER check_user_limit
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION user_login_limit();
