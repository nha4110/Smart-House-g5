   const express = require('express');
   const router = express.Router();
   const pool = require('../db');

   router.get('/:id', async (req, res) => {
     const { id } = req.params;

     try {
       // Fetch device
       const deviceResult = await pool.query(
         'SELECT * FROM devices WHERE device_id = $1',
         [id]
       );
       if (deviceResult.rows.length === 0) {
         return res.status(404).json({ error: 'Device not found' });
       }
       const device = deviceResult.rows[0];

       // Fetch event logs
       const eventLogsResult = await pool.query(
         `SELECT event_type, details, timestamp 
          FROM event_logs 
          WHERE device_id = $1 
          ORDER BY timestamp DESC 
          LIMIT 20`,
         [id]
       );
       console.log('Event logs for device_id', id, ':', eventLogsResult.rows);

       // Fetch related rules (basic match: action mentions device name)
       const rulesResult = await pool.query(
         `SELECT rule_id, name, description, is_active, trigger_type, action 
          FROM automation_rules 
          WHERE action ILIKE $1 
          ORDER BY rule_id ASC`,
         [`%${device.name}%`]
       );
       console.log('Rules for device_id', id, ':', rulesResult.rows);

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
       await pool.query(
         'UPDATE devices SET status = $1 WHERE device_id = $2',
         [status, id]
       );
       res.json({ success: true, status });
     } catch (err) {
       console.error('Error updating status:', err);
       res.status(500).json({ error: 'Failed to update status' });
     }
   });

   router.delete('/:id', async (req, res) => {
     const { id } = req.params;

     try {
       await pool.query('DELETE FROM devices WHERE device_id = $1', [id]);
       res.json({ success: true });
     } catch (err) {
       console.error('Error deleting device:', err);
       res.status(500).json({ error: 'Failed to delete device' });
     }
   });

   module.exports = router;