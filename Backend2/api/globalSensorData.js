const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/global-sensor-data - Fetch all sensor data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM global_sensor_data ORDER BY recorded_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /global-sensor-data error:', err);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

// POST /api/global-sensor-data - Add new sensor data
router.post('/', async (req, res) => {
  const { sensor_type, temperature, humidity, rain_detected } = req.body;

  if (!sensor_type) {
    return res.status(400).json({ error: 'Missing sensor_type' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO global_sensor_data (sensor_type, temperature, humidity, rain_detected)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [sensor_type, temperature, humidity, rain_detected]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /global-sensor-data error:', err);
    res.status(500).json({ error: 'Failed to insert sensor data' });
  }
});

module.exports = router;
