const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Adjust path to match your project structure

async function getLatestGlobalSensorData() {
  const result = await pool.query(`
    SELECT * FROM global_sensor_data
    ORDER BY recorded_at DESC
    LIMIT 1
  `);
  return result.rows[0];
}

async function simulateBehavior(deviceName) {
  const data = await getLatestGlobalSensorData();
  const now = new Date();
  const hour = now.getHours();

  switch (deviceName) {
    case 'DHT11 Sensor':
      return {
        device: deviceName,
        type: 'sensor',
        reading: {
          temperature: data?.temperature,
          humidity: data?.humidity,
        }
      };

    case 'Air Conditioner': {
      const shouldBeOn = !data?.rain_detected && data?.temperature > 30;
      return {
        device: deviceName,
        type: 'actuator',
        status: shouldBeOn ? 'on' : 'off',
        reason: shouldBeOn
          ? 'High temperature, no rain'
          : data?.rain_detected
            ? 'Rain detected'
            : 'Temperature is normal',
      };
    }

    case 'Windows': {
      const shouldBeClosed = data?.rain_detected || data?.humidity > 80;
      return {
        device: deviceName,
        type: 'actuator',
        status: shouldBeClosed ? 'closed' : 'open',
        reason: shouldBeClosed
          ? (data?.rain_detected
              ? 'Rain detected'
              : 'Humidity above 80')
          : 'Clear weather and humidity normal',
      };
    }

    case 'Main Door': {
      const isLocked = hour >= 20 || hour < 6;
      return {
        device: deviceName,
        type: 'actuator',
        status: isLocked ? 'locked' : 'unlocked',
        reason: isLocked
          ? 'Locked during night hours (20:00 - 06:00)'
          : 'Unlocked during daytime',
      };
    }

    default:
      return {
        device: deviceName,
        message: 'No smart behavior logic found for this device'
      };
  }
}

// API endpoint to get device behavior based on device name
router.get('/device-behavior/:deviceName', async (req, res) => {
  try {
    const deviceName = req.params.deviceName;
    const behavior = await simulateBehavior(deviceName);
    res.json(behavior);
  } catch (err) {
    console.error('GET /device-behavior error:', err);
    res.status(500).json({ error: 'Failed to fetch device behavior' });
  }
});

module.exports = router;