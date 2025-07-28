-- ✅ Drop Old Tables
DROP TABLE IF EXISTS rfid_access, event_logs, automation_rules, sensor_data, devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ✅ Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Limit to 5 users
CREATE OR REPLACE FUNCTION user_login_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) >= 5 THEN
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
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  module_name TEXT,
  status TEXT DEFAULT 'inactive',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Sensor Data Table
CREATE TABLE sensor_data (
  sensor_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  temperature FLOAT,
  humidity FLOAT,
  rain_detected BOOLEAN,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Automation Rules Table
CREATE TABLE automation_rules (
  rule_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  trigger_type TEXT,
  action TEXT
);

-- ✅ Event Logs Table (FIXED)
CREATE TABLE event_logs (
  event_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  event_type TEXT DEFAULT 'state_change',
  details JSONB, -- 💡 store state object here
  triggered_by TEXT DEFAULT 'simulation',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Limit Event Logs to 20 Per Device (Fixed)
CREATE OR REPLACE FUNCTION enforce_event_log_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM event_logs
  WHERE device_id = NEW.device_id
  AND event_id NOT IN (
    SELECT event_id FROM event_logs
    WHERE device_id = NEW.device_id
    ORDER BY timestamp DESC
    LIMIT 20
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS event_log_limit_trigger ON event_logs;

CREATE TRIGGER event_log_limit_trigger
AFTER INSERT ON event_logs
FOR EACH ROW
EXECUTE FUNCTION enforce_event_log_limit();

-- ✅ RFID Access Table
CREATE TABLE rfid_access (
  access_id SERIAL PRIMARY KEY,
  card_uid TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  was_successful BOOLEAN,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
