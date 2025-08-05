const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { device_id, card_uid, is_valid, was_successful } = req.body;

  if (!device_id || !card_uid || is_valid === undefined || was_successful === undefined) {
    return res.status(400).json({ error: 'Missing required fields: device_id, card_uid, is_valid, was_successful' });
  }

  try {
    const deviceResult = await pool.query(
      'SELECT device_id, name FROM devices WHERE device_id = $1',
      [device_id]
    );
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    if (!deviceResult.rows[0].name.toLowerCase().includes('rfid reader')) {
      return res.status(400).json({ error: 'Device is not an RFID Reader' });
    }

    const result = await pool.query(
      `INSERT INTO rfid_access (device_id, card_uid, is_valid, was_successful, attempted_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING access_id, device_id, card_uid, is_valid, was_successful, attempted_at`,
      [device_id, card_uid, is_valid, was_successful]
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('Logged RFID access for device_id', device_id, ':', result.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error logging RFID access:', err);
    res.status(500).json({ error: 'Failed to log RFID access' });
  }
});

module.exports = router;