// Backend2/api/simulate.js

const express = require('express');
const router = express.Router();
const { simulateBehavior } = require('./sensorProcessor');

router.post('/', async (req, res) => {
  const { deviceName } = req.body;

  if (!deviceName) {
    return res.status(400).json({ error: 'Missing device name' });
  }

  try {
    const result = await simulateBehavior(deviceName);
    res.json(result);
  } catch (err) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

module.exports = router;
