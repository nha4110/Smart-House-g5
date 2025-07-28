const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/devices - Fetch all devices
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM devices ORDER BY device_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /devices error:', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// POST /api/devices - Add a new device
router.post('/', async (req, res) => {
  const { name, type, location, status, module: module_name } = req.body;

  console.log('POST /devices payload:', req.body);

  if (!name || !type || !location || !status || !module_name) {
    return res.status(400).json({ error: 'Missing device data' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO devices (name, type, location, status, module_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, type, location, status, module_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /devices error:', err);
    res.status(500).json({ error: 'Failed to add device' });
  }
});

module.exports = router;
