const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deviceResult = await pool.query(
      'SELECT * FROM devices WHERE device_id = $1',
      [id]
    );
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    const device = deviceResult.rows[0];

    const eventLogsResult = await pool.query(
      `SELECT event_type, details, timestamp 
       FROM event_logs 
       WHERE device_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 20`,
      [id]
    );

    const rulesResult = await pool.query(
      `SELECT rule_id, name, description, is_active, trigger_type, action 
       FROM automation_rules 
       WHERE action ILIKE $1 
       ORDER BY rule_id ASC`,
      [`%${device.name}%`]
    );

    // Log event logs and rules only in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Event logs for device_id', id, ':', eventLogsResult.rows);
      console.log('Rules for device_id', id, ':', rulesResult.rows);
    }

    res.json({ ...device, event_logs: eventLogsResult.rows, rules: rulesResult.rows });
  } catch (err) {
    console.error('Error fetching device info:', err);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const currentDevice = await pool.query(
      'SELECT status FROM devices WHERE device_id = $1',
      [id]
    );
    if (currentDevice.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    const previousStatus = currentDevice.rows[0].status;

    await pool.query(
      'UPDATE devices SET status = $1, last_updated = CURRENT_TIMESTAMP WHERE device_id = $2',
      [status, id]
    );

    console.log(`Device ${id} status changed from ${previousStatus} to ${status}`);
    res.json({ success: true, status });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM event_logs WHERE device_id = $1', [id]);
    await pool.query('DELETE FROM devices WHERE device_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

module.exports = router;