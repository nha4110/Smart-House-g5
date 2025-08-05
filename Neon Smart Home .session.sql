-- ✅ Drop Old Tables
DROP TABLE IF EXISTS rfid_access, event_logs, automation_rules, sensor_data, global_sensor_data, devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ✅ Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Limit to 5 users
CREATE OR REPLACE FUNCTION enforce_user_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM users) >= 5 THEN
    RAISE EXCEPTION 'Maximum concurrent users reached. Please wait...' USING ERRCODE = 'P0001';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_limit ON users;

CREATE TRIGGER trigger_user_limit
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION enforce_user_limit();

-- ✅ Devices Table
CREATE TABLE devices (
  device_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  module_name TEXT,
  status TEXT DEFAULT 'off',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Renamed Global Sensor Data Table (no device_id)
CREATE TABLE global_sensor_data (
  sensor_id SERIAL PRIMARY KEY,
  sensor_type TEXT NOT NULL,       -- e.g., 'climate', 'rain', etc.
  temperature FLOAT,
  humidity FLOAT,
  rain_detected BOOLEAN,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Trigger to ensure only one row in global_sensor_data
CREATE OR REPLACE FUNCTION enforce_single_row_global_sensor_data()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM global_sensor_data;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS single_row_trigger ON global_sensor_data;

CREATE TRIGGER single_row_trigger
BEFORE INSERT ON global_sensor_data
FOR EACH ROW
EXECUTE FUNCTION enforce_single_row_global_sensor_data();

-- ✅ Automation Rules Table (linked to devices)
CREATE TABLE automation_rules (
  rule_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  trigger_type TEXT,
  action TEXT
);

-- ✅ Event Logs Table (linked to devices)
CREATE TABLE event_logs (
  event_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id) ON DELETE CASCADE,
  event_type TEXT DEFAULT 'state_change',
  details JSONB,
  triggered_by TEXT DEFAULT 'simulation',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ Limit Event Logs to 20 Per Device
CREATE OR REPLACE FUNCTION enforce_event_log_limit()
RETURNS TRIGGER AS $$
BEGIN
  WITH ranked AS (
    SELECT event_id
    FROM event_logs
    WHERE device_id = NEW.device_id
    ORDER BY event_id DESC
    OFFSET 20
  )
  DELETE FROM event_logs
  WHERE event_id IN (SELECT event_id FROM ranked);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS event_log_limit_trigger ON event_logs;

CREATE TRIGGER event_log_limit_trigger
AFTER INSERT ON event_logs
FOR EACH ROW
EXECUTE FUNCTION enforce_event_log_limit();

-- ✅ RFID Access Table (linked to devices)
CREATE TABLE rfid_access (
  access_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id) ON DELETE CASCADE,
  card_uid TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  was_successful BOOLEAN,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);