const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/event-logs - Fetch all event logs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM event_logs ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /event-logs error:', err);
    res.status(500).json({ error: 'Failed to fetch event logs' });
  }
});

// POST /api/event-logs - Insert a new event log
router.post('/', async (req, res) => {
  const { device_id, event_type = 'state_change', details, triggered_by = 'simulation' } = req.body;

  if (!device_id || !details) {
    return res.status(400).json({ error: 'Missing required event log data' });
  }

  try {
    // Ensure details is properly formatted as JSON
    const formattedDetails = typeof details === 'string' ? JSON.parse(details) : details;
    
    const result = await pool.query(
      `INSERT INTO event_logs (device_id, event_type, details, triggered_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [device_id, event_type, formattedDetails, triggered_by]
    );

    console.log(`📝 Event logged for device ${device_id}: ${event_type} by ${triggered_by}`);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /event-logs error:', err);
    res.status(500).json({ error: 'Failed to log event' });
  }
});

module.exports = router;