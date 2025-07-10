// routes/devices.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all devices
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY device_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /devices error:', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Add new device
router.post('/', async (req, res) => {
  const { name, type, location, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO devices (name, type, location, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [name, type, location, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /devices error:', err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});

module.exports = router;
