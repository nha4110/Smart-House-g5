-- ✅ Keep Existing Users Table
DROP TABLE IF EXISTS rfid_access, event_logs, automation_rules, sensor_data, devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Limit to 3 users
CREATE OR REPLACE FUNCTION user_login_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) >= 3 THEN
    RAISE EXCEPTION 'Maximum number of users reached' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_user_limit ON users;

CREATE TRIGGER check_user_limit
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION user_login_limit();

-- ✅ Devices Table
CREATE TABLE devices (
  device_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,               -- e.g., "Living Room Light"
  type TEXT NOT NULL,               -- e.g., "window", "sensor", "lock", "button"
  location TEXT NOT NULL,           -- e.g., "kitchen"
  status TEXT DEFAULT 'inactive',   -- "on", "off", "open", "closed"
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Sensor Data (optional logs)
CREATE TABLE sensor_data (
  sensor_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  temperature FLOAT,
  humidity FLOAT,
  rain_detected BOOLEAN,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Automation Rules
CREATE TABLE automation_rules (
  rule_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                -- "Rainy Day Auto Close"
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  trigger_type TEXT,                -- "rain", "humidity", "manual"
  action TEXT                       -- "close_windows", etc.
);

-- ✅ Event Logs
CREATE TABLE event_logs (
  event_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  event_type TEXT,                  -- "opened", "locked", etc.
  details TEXT,
  triggered_by TEXT,                -- "user", "rule", "sensor"
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ RFID Access Table
CREATE TABLE rfid_access (
  access_id SERIAL PRIMARY KEY,
  card_uid TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  was_successful BOOLEAN,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
