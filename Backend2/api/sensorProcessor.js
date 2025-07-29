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

async function logBehaviorToEventLog(deviceId, behavior) {
  try {
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
    // Don't throw; allow the response to proceed
  }
}

async function simulateBehavior(deviceName) {
  try {
    const data = await getLatestGlobalSensorData();
    const now = new Date();
    const hour = now.getHours();

    let behavior;
    switch (deviceName) {
      case 'DHT11 Sensor':
        behavior = {
          device: deviceName,
          type: 'sensor',
          reading: {
            temperature: data.temperature,
            humidity: data.humidity,
          },
        };
        break;

      case 'Air Conditioner': {
        const shouldBeOn = !data.rain_detected && data.temperature > 30;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeOn ? 'on' : 'off',
          reason: shouldBeOn
            ? 'High temperature, no rain'
            : data.rain_detected
              ? 'Rain detected'
              : 'Temperature is normal',
        };
        break;
      }

      case 'Windows': {
        const shouldBeClosed = data.rain_detected || data.humidity > 80;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: shouldBeClosed ? 'closed' : 'open',
          reason: shouldBeClosed
            ? (data.rain_detected ? 'Rain detected' : 'Humidity above 80')
            : 'Clear weather and humidity normal',
        };
        break;
      }

      case 'Main Door': {
        const isLocked = hour >= 20 || hour < 6;
        behavior = {
          device: deviceName,
          type: 'actuator',
          status: isLocked ? 'locked' : 'unlocked',
          reason: isLocked
            ? 'Locked during night hours (20:00 - 06:00)'
            : 'Unlocked during daytime',
        };
        break;
      }

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
      // Continue to return behavior even if logging fails
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