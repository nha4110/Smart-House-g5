const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { device_id, name, description, is_active, trigger_type, action } = req.body;

  if (!device_id || !name || !trigger_type || !action) {
    return res.status(400).json({ error: 'Missing required fields: device_id, name, trigger_type, action' });
  }

  try {
    const deviceResult = await pool.query(
      'SELECT device_id FROM devices WHERE device_id = $1',
      [device_id]
    );
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const result = await pool.query(
      `INSERT INTO automation_rules (device_id, name, description, is_active, trigger_type, action)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING rule_id, device_id, name, description, is_active, trigger_type, action`,
      [device_id, name, description, is_active ?? true, trigger_type, action]
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('Created rule for device_id', device_id, ':', result.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating rule:', err);
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

router.put('/:rule_id', async (req, res) => {
  const { rule_id } = req.params;
  const { name, description, is_active, trigger_type, action } = req.body;

  if (!name || !trigger_type || !action) {
    return res.status(400).json({ error: 'Missing required fields: name, trigger_type, action' });
  }

  try {
    const result = await pool.query(
      `UPDATE automation_rules 
       SET name = $1, description = $2, is_active = $3, trigger_type = $4, action = $5
       WHERE rule_id = $6
       RETURNING rule_id, device_id, name, description, is_active, trigger_type, action`,
      [name, description, is_active ?? true, trigger_type, action, rule_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Updated rule_id', rule_id, ':', result.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating rule:', err);
    res.status(500).json({ error: 'Failed to update rule' });
  }
});

module.exports = router;