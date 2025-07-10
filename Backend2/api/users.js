const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/users
router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountResult.rows[0].count, 10);

    if (userCount >= 3) {
      return res.status(403).json({ error: 'Maximum number of users reached' });
    }

    const insertResult = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
