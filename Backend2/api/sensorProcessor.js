const express = require('express');
const router = express.Router();
const pool = require('../db');

// Debug log to verify pool import
console.log('Pool imported in sensorProcessor:', pool ? 'Defined' : 'Undefined');

async function getLatestGlobalSensorData() {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }
    const result = await pool.query(`
      SELECT temperature, humidity, rain_detected, recorded_at
      FROM global_sensor_data
      ORDER BY recorded_at DESC
      LIMIT 1
    `);
    if (!result.rows[0]) {
      throw new Error('No data found in global_sensor_data');
    }
    return result.rows[0];
  } catch (err) {
    console.error('Error in getLatestGlobalSensorData:', err.message);
    throw err;
  }
}

async function getDeviceIdByName(deviceName) {
  try {
    const result = await pool.query(
      `SELECT device_id FROM devices WHERE name ILIKE $1 || '%' LIMIT 1`,
      [deviceName]
    );
    if (!result.rows[0]) {
      throw new Error(`Device not found: ${deviceName}`);
    }
    return result.rows[0].device_id;
  } catch (err) {
    console.error('Error in getDeviceIdByName:', err.message);
    throw err;
  }
}

async function shouldLogBehavior(deviceId, behavior) {
  try {
    const result = await pool.query(
      `SELECT details FROM event_logs
       WHERE device_id = $1 AND event_type = 'behavior_update'
       AND timestamp >= NOW() - INTERVAL '5 seconds'
       ORDER BY timestamp DESC LIMIT 1`,
      [deviceId]
    );
    if (result.rows[0]) {
      const lastDetails = result.rows[0].details;
      if (
        lastDetails.status === (behavior.status || null) &&
        lastDetails.reason === (behavior.reason || null) &&
        JSON.stringify(lastDetails.reading) === JSON.stringify(behavior.reading || null)
      ) {
        console.log(`Skipping duplicate behavior log for device_id ${deviceId}`);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error in shouldLogBehavior:', err.message);
    return true; // Log if check fails
  }
}

async function logBehaviorToEventLog(deviceId, behavior) {
  try {
    if (!(await shouldLogBehavior(deviceId, behavior))) {
      return;
    }
    const details = {
      status: behavior.status || null,
      reason: behavior.reason || null,
      reading: behavior.reading || null,
    };
    await pool.query(
      `INSERT INTO event_logs (device_id, event_type, details, triggered_by)
       VALUES ($1, $2, $3, $4)`,
      [deviceId, 'behavior_update', details, 'simulation']
    );
    console.log(`Logged behavior for device_id ${deviceId}:`, details);
  } catch (err) {
    console.error('Error in logBehaviorToEventLog:', err.message);
  }
}

async function simulateBehavior(deviceName) {
  try {
    const data = await getLatestGlobalSensorData();
    const now = new Date();
    const hour = now.getHours();

    let behavior;
    switch (deviceName) {
      // Module 1 Devices
      case 'DHT11 Sensor':
        behavior = {
          device: deviceName,
          type: 'sensor',
          reading: {
            temperature: data.temperature,
            humidity: data.humidity,
          },
          reason: 'Temperature and humidity reading',
        };
        break;

      case 'Air Conditioner':
        const shouldBeOnAC = !data.rain_detected && data.temperature > 30;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeOnAC ? 'on' : 'off',
          reason: shouldBeOnAC
            ? 'Temperature above 30°C, no rain'
            : data.rain_detected
              ? 'Rain detected'
              : 'Temperature 25°C or below',
        };
        break;

      case 'Dehumidifier':
        const shouldBeOnDH = data.humidity >= 72;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeOnDH ? 'on' : 'off',
          reason: shouldBeOnDH ? 'Humidity 72% or higher' : 'Humidity below 72%',
        };
        break;

      case 'Windows':
      case 'Servo Motor (Window 1)':
      case 'Servo Motor (Window 2)':
        const shouldBeClosedWin = data.rain_detected || data.humidity > 72;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeClosedWin ? 'closed' : 'open',
          reason: shouldBeClosedWin
            ? data.rain_detected
              ? 'Rain detected'
              : 'Humidity above 72%'
            : 'No rain and humidity 72% or lower',
        };
        break;

      case 'Main Door':
      case 'Servo Motor (Main Door)':
        const isLocked = hour >= 20 || hour < 6;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: isLocked ? 'locked' : 'unlocked',
          reason: isLocked
            ? 'Locked during night hours (20:00–06:00)'
            : 'Unlocked during daytime',
        };
        break;

      // Module 2 Devices
      case 'Rain Sensor':
        behavior = {
          device: deviceName,
          type: 'sensor',
          status: data.rain_detected ? 'true' : 'false',
          reason: data.rain_detected ? 'Rain detected' : 'No rain detected',
        };
        break;

      case 'Servo Motor (Roof)':
      case 'Servo Motor (Door)':
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: data.rain_detected ? 'closed' : 'open',
          reason: data.rain_detected ? 'Rain detected' : 'No rain detected',
        };
        break;

      case 'Hot/Cold Water Tank':
        const shouldBeOnTank = data.temperature > 30 || data.temperature < 20;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeOnTank ? 'on' : 'off',
          reason: shouldBeOnTank
            ? data.temperature > 30
              ? 'Temperature above 30°C'
              : 'Temperature below 20°C'
            : 'Temperature between 20°C and 30°C',
        };
        break;

      case 'LED Indicator':
        const tankStatus = data.temperature > 30 || data.temperature < 20 ? 'on' : 'off';
        behavior = {
          device: deviceName,
          type: 'display',
          status: tankStatus,
          reason: `Reflecting Hot/Cold Water Tank status: ${tankStatus}`,
        };
        break;

      // Module 3 Devices
      case 'Buttons':
        behavior = {
          device: deviceName,
          type: 'input',
          message: 'Manual toggle input not simulated',
        };
        break;

      case 'LED Indicators':
        behavior = {
          device: deviceName,
          type: 'display',
          message: 'Device status display not simulated',
        };
        break;

      case 'Lights':
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: 'off',
          reason: 'Manual toggle not simulated, default off',
        };
        break;

      // Module 4 Devices
      case '4x4 Keypad':
        behavior = {
          device: deviceName,
          type: 'input',
          message: 'Password input not simulated',
        };
        break;

      case 'LCD 1602 Display':
        const doorStatus = hour >= 20 || hour < 6 ? 'locked' : 'unlocked';
        behavior = {
          device: deviceName,
          type: 'display',
          status: doorStatus,
          reason: `Displaying Main Door status: ${doorStatus}`,
        };
        break;

      case 'RFID Reader':
        behavior = {
          device: deviceName,
          type: 'input',
          message: 'Card scan not simulated',
        };
        break;

      default:
        behavior = {
          device: deviceName,
          message: 'No smart behavior logic found for this device',
        };
    }

    // Fetch device_id and log behavior to event_logs
    try {
      const deviceId = await getDeviceIdByName(deviceName);
      await logBehaviorToEventLog(deviceId, behavior);
    } catch (err) {
      console.error(`Failed to log behavior for ${deviceName}:`, err.message);
    }

    return behavior;
  } catch (err) {
    console.error('Error in simulateBehavior:', err.message);
    throw err;
  }
}

// API endpoint to get device behavior based on device name
router.get('/device-behavior/:deviceName', async (req, res) => {
  try {
    const deviceName = req.params.deviceName;
    const behavior = await simulateBehavior(deviceName);
    res.json(behavior);
  } catch (err) {
    console.error('GET /device-behavior error:', err.message);
    res.status(500).json({ error: 'Failed to fetch device behavior', details: err.message });
  }
});

module.exports = router;