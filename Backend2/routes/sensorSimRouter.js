const express = require('express');
const router = express.Router();
const pool = require('../db');

// Simulate one climate sensor data entry
router.post('/', async (req, res) => {
  try {
    const temperature = (20 + Math.random() * 10).toFixed(2);
    const humidity = (40 + Math.random() * 30).toFixed(2);
    const rain_detected = Math.random() < 0.3;

    const result = await pool.query(
      `INSERT INTO global_sensor_data (sensor_type, temperature, humidity, rain_detected)
       VALUES ('climate', $1, $2, $3) RETURNING *`,
      [temperature, humidity, rain_detected]
    );

    res.json({
      message: '✅ Simulated sensor data inserted',
      data: {
        sensor_type: 'climate',
        temperature: Number(temperature),
        humidity: Number(humidity),
        rain_detected: rain_detected
      }
    });
  } catch (error) {
    console.error('❌ Simulate error:', error.message);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

module.exports = router;
