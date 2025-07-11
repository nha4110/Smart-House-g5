-- Drop existing tables if needed
DROP TABLE IF EXISTS rfid_access, event_logs, automation_rules, sensor_data, devices, users CASCADE;

-- 1. Users
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'homeowner'
);

-- 2. Devices
CREATE TABLE devices (
  device_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                -- "Living Room Window"
  type TEXT NOT NULL,                -- "window", "sensor", "lock"
  location TEXT NOT NULL,            -- "kitchen", "living room", etc.
  status TEXT,                       -- "on", "off", "open", "closed"
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sensor Data (optional, only if you want to store logs over time)
CREATE TABLE sensor_data (
  sensor_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  temperature FLOAT,
  humidity FLOAT,
  rain_detected BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Automation Rules
CREATE TABLE automation_rules (
  rule_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,                 -- "Rainy Day Auto Close"
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  trigger_type TEXT NOT NULL,         -- "rain", "humidity", "manual"
  action TEXT NOT NULL                -- "close_windows", "lock_doors"
);

-- 5. Event Logs
CREATE TABLE event_logs (
  event_id SERIAL PRIMARY KEY,
  device_id INTEGER REFERENCES devices(device_id),
  event_type TEXT NOT NULL,          -- "opened", "closed", "turned_on"
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. RFID Access Attempts
CREATE TABLE rfid_access (
  access_id SERIAL PRIMARY KEY,
  card_uid TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  was_successful BOOLEAN,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert dummy data
INSERT INTO devices (name, type, location, status) VALUES
('Living Room Window', 'window', 'living room', 'closed'),
('Kitchen Sensor', 'sensor', 'kitchen', 'active'),
('Main Door Lock', 'lock', 'front door', 'locked'),
('Drying Porch Roof', 'roof', 'drying area', 'open');
