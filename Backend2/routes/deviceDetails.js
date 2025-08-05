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
       WHERE device_id = $1 
       ORDER BY rule_id ASC`,
      [id]
    );

    let rfidLogs = [];
    if (device.name.toLowerCase().includes('rfid reader')) {
      const rfidResult = await pool.query(
        `SELECT access_id, card_uid, is_valid, was_successful, attempted_at 
         FROM rfid_access 
         WHERE device_id = $1 
         ORDER BY attempted_at DESC 
         LIMIT 20`,
        [id]
      );
      rfidLogs = rfidResult.rows;
    }

    // Log event logs and rules only in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Event logs for device_id', id, ':', eventLogsResult.rows);
      console.log('Rules for device_id', id, ':', rulesResult.rows);
      if (rfidLogs.length > 0) {
        console.log('RFID logs for device_id', id, ':', rfidLogs);
      }
    }

    res.json({ ...device, event_logs: eventLogsResult.rows, rules: rulesResult.rows, rfid_logs: rfidLogs });
  } catch (err) {
    console.error('Error fetching device info:', err);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['on', 'off'].includes(status.toLowerCase())) {
    return res.status(400).json({ error: 'Status must be either "on" or "off"' });
  }

  try {
    // Get current device info
    const currentDevice = await pool.query(
      'SELECT device_id, name, status FROM devices WHERE device_id = $1',
      [id]
    );
    if (currentDevice.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    const device = currentDevice.rows[0];
    const previousStatus = device.status;
    const newStatus = status.toLowerCase();

    // Update device status and timestamp
    await pool.query(
      'UPDATE devices SET status = $1, last_updated = CURRENT_TIMESTAMP WHERE device_id = $2',
      [newStatus, id]
    );

    // Log the status change event
    await pool.query(
      `INSERT INTO event_logs (device_id, event_type, details, triggered_by)
       VALUES ($1, $2, $3, $4)`,
      [
        id,
        'status_change',
        {
          previous_status: previousStatus,
          new_status: newStatus,
          reason: `Manual toggle from ${previousStatus} to ${newStatus}`,
          timestamp: new Date().toISOString()
        },
        'user'
      ]
    );

    console.log(`✅ Device ${id} (${device.name}) status manually changed from ${previousStatus} to ${newStatus}`);
    
    res.json({ 
      success: true, 
      status: newStatus,
      previous_status: previousStatus,
      device_name: device.name,
      message: `Device ${device.name} successfully ${newStatus === 'on' ? 'turned on' : 'turned off'}`
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM devices WHERE device_id = $1', [id]);
    // ON DELETE CASCADE handles event_logs, automation_rules, rfid_access
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

module.exports = router;