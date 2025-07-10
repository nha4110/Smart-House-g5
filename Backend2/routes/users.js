const express = require('express');
const router = express.Router();
const pool = require('../db'); // ✅ reuse from db.js

router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already exists' });
    } else if (err.code === 'P0001') {
      return res.status(403).json({ error: 'Maximum number of users reached' });
    } else {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  }
});

module.exports = router;
