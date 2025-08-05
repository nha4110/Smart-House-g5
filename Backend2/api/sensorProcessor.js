const express = require('express');
const router = express.Router();
const pool = require('../db');

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

async function getDeviceInfo(deviceId, deviceName, isAutoSimulation = false) {
  try {
    let result;
    if (deviceId) {
      result = await pool.query(
        `SELECT device_id, name, status, last_updated FROM devices WHERE device_id = $1`,
        [deviceId]
      );
    } else {
      result = await pool.query(
        `SELECT device_id, name, status, last_updated FROM devices WHERE name ILIKE $1 || '%' LIMIT 1`,
        [deviceName]
      );
    }
    if (!result.rows[0]) {
      throw new Error(`Device not found: ${deviceId || deviceName}`);
    }
    const deviceInfo = result.rows[0];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Device info for ${deviceId || deviceName} (auto: ${isAutoSimulation}):`, {
        device_id: deviceInfo.device_id,
        name: deviceInfo.name,
        status: deviceInfo.status,
        last_updated: deviceInfo.last_updated,
      });
    }

    if (deviceInfo.status.toLowerCase() !== 'on') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Skipping behavior for device_id ${deviceInfo.device_id}: device is ${deviceInfo.status}`);
      }
      return { device: deviceInfo.name, message: `Device is ${deviceInfo.status}` };
    }

    if (isAutoSimulation) {
      const now = new Date();
      const lastUpdated = new Date(deviceInfo.last_updated);
      const timeDiff = (now - lastUpdated) / 1000; // Seconds
      if (timeDiff > 60) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Skipping auto-simulation for device_id ${deviceInfo.device_id}: not recently toggled`);
        }
        return { device: deviceInfo.name, message: 'Device not recently toggled on' };
      }
    }

    return deviceInfo;
  } catch (err) {
    console.error('Error in getDeviceInfo:', err.message);
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
        if (process.env.NODE_ENV === 'development') {
          console.log(`Skipping duplicate behavior log for device_id ${deviceId}`);
        }
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error in shouldLogBehavior:', err.message);
    return true;
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

async function simulateBehavior(deviceName, deviceId = null, isAutoSimulation = false) {
  try {
    const deviceInfo = await getDeviceInfo(deviceId, deviceName, isAutoSimulation);
    
    if ('message' in deviceInfo) {
      return deviceInfo;
    }

    const data = await getLatestGlobalSensorData();
    const now = new Date();
    const hour = now.getHours();
    const baseDeviceName = deviceInfo.name.split('#')[0].trim();
    let behavior;

    switch (baseDeviceName) {
      case 'DHT11 Sensor':
        behavior = {
          device: deviceInfo.name,
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
          device: deviceInfo.name,
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
          device: deviceInfo.name,
          type: 'actuator',
          status: shouldBeOnDH ? 'on' : 'off',
          reason: shouldBeOnDH ? 'Humidity 72% or higher' : 'Humidity below 72%',
        };
        break;
case 'Windows':
case 'Servo Motor (Window 1)':
case 'Servo Motor (Window 2)':
  // Enhanced sensor-based window logic
  let windowStatus, windowReason;
  
  // PRIORITY 1: Emergency close conditions
  const emergencyClose = data.rain_detected || data.humidity > 80 || data.temperature > 40;
  
  // PRIORITY 2: Forced open conditions (ventilation needed)
  const forceOpen = data.temperature > 35 && !data.rain_detected && data.humidity < 60;
  
  // PRIORITY 3: Smart ventilation logic
  const needsVentilation = data.humidity > 75 && !data.rain_detected;
  const goodWeather = !data.rain_detected && data.temperature >= 22 && data.temperature <= 30 && data.humidity < 70;
  
  if (emergencyClose) {
    windowStatus = 'closed';
    if (data.rain_detected) {
      windowReason = 'Emergency close: Rain detected';
    } else if (data.humidity > 80) {
      windowReason = 'Emergency close: Humidity exceeds 80%';
    } else if (data.temperature > 40) {
      windowReason = 'Emergency close: Extreme heat (>40°C)';
    }
  } else if (forceOpen) {
    windowStatus = 'open';
    windowReason = 'Forced open: High temperature (>35°C), low humidity, no rain';
  } else if (needsVentilation) {
    windowStatus = 'open';
    windowReason = 'Open for ventilation: High humidity (>75%), no rain';
  } else if (goodWeather) {
    windowStatus = 'open';
    windowReason = 'Open: Good weather conditions (22-30°C, <70% humidity, no rain)';
  } else {
    // Default logic - close if conditions aren't ideal
    windowStatus = 'closed';
    if (data.temperature < 22) {
      windowReason = 'Closed: Temperature too low (<22°C)';
    } else if (data.temperature > 30) {
      windowReason = 'Closed: Temperature too high (>30°C)';
    } else if (data.humidity >= 70) {
      windowReason = 'Closed: Humidity too high (≥70%)';
    } else {
      windowReason = 'Closed: Default safety position';
    }
  }
  
  behavior = {
    device: deviceInfo.name,
    type: 'actuator',
    status: windowStatus,
    reason: windowReason,
  };
  break;

      case 'Main Door':
      case 'Servo Motor (Main Door)':
        const isLocked = hour >= 20 || hour < 6;
        behavior = {
          device: deviceInfo.name,
          type: 'actuator',
          status: isLocked ? 'locked' : 'unlocked',
          reason: isLocked
            ? 'Locked during night hours (20:00–06:00)'
            : 'Unlocked during daytime',
        };
        break;

      case 'Rain Sensor':
        behavior = {
          device: deviceInfo.name,
          type: 'sensor',
          status: data.rain_detected ? 'true' : 'false',
          reason: data.rain_detected ? 'Rain detected' : 'No rain detected',
        };
        break;

      case 'Servo Motor (Roof)':
      case 'Servo Motor (Door)':
        behavior = {
          device: deviceInfo.name,
          type: 'actuator',
          status: data.rain_detected ? 'closed' : 'open',
          reason: data.rain_detected ? 'Rain detected' : 'No rain detected',
        };
        break;

      case 'Hot/Cold Water Tank':
        const shouldBeOnTank = data.temperature > 30 || data.temperature < 20;
        behavior = {
          device: deviceInfo.name,
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
          device: deviceInfo.name,
          type: 'display',
          status: tankStatus,
          reason: `Reflecting Hot/Cold Water Tank status: ${tankStatus}`,
        };
        break;

      case 'Buttons':
        behavior = {
          device: deviceInfo.name,
          type: 'input',
          message: 'Manual toggle input not simulated',
        };
        break;

      case 'LED Indicators':
        behavior = {
          device: deviceInfo.name,
          type: 'display',
          message: 'Device status display not simulated',
        };
        break;

      case 'Lights':
        behavior = {
          device: deviceInfo.name,
          type: 'actuator',
          status: 'off',
          reason: 'Manual toggle not simulated, default off',
        };
        break;

      case '4x4 Keypad':
        behavior = {
          device: deviceInfo.name,
          type: 'input',
          message: 'Password input not simulated',
        };
        break;

      case 'LCD 1602 Display':
        const doorStatus = hour >= 20 || hour < 6 ? 'locked' : 'unlocked';
        behavior = {
          device: deviceInfo.name,
          type: 'display',
          status: doorStatus,
          reason: `Displaying Main Door status: ${doorStatus}`,
        };
        break;

      case 'RFID Reader':
        behavior = {
          device: deviceInfo.name,
          type: 'input',
          message: 'Card scan not simulated',
        };
        break;

      default:
        behavior = {
          device: deviceInfo.name,
          message: 'No smart behavior logic found for this device',
        };
    }

    if (behavior.message) {
      return behavior;
    }

    try {
      await logBehaviorToEventLog(deviceInfo.device_id, behavior);
    } catch (err) {
      console.error(`Failed to log behavior for ${deviceInfo.name}:`, err.message);
    }

    return behavior;
  } catch (err) {
    console.error('Error in simulateBehavior:', err.message);
    throw err;
  }
}

router.get('/device-behavior/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isDeviceId = !isNaN(parseInt(identifier));
    const behavior = isDeviceId
      ? await simulateBehavior(null, parseInt(identifier))
      : await simulateBehavior(identifier);
    res.json(behavior);
  } catch (err) {
    console.error('GET /device-behavior error:', err.message);
    res.status(500).json({ error: 'Failed to fetch device behavior', details: err.message });
  }
});

module.exports = router;