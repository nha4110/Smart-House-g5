// ✅ File: Backend2/routes/test.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/test - tries to insert 4 test users
router.post('/', async (req, res) => {
  const usernames = ['User1', 'User2', 'User3', 'User4'];
  const results = [];

  for (const username of usernames) {
    try {
      const result = await pool.query(
        'INSERT INTO users (username) VALUES ($1) RETURNING *',
        [username]
      );
      results.push({ username, status: 'success', user: result.rows[0] });
    } catch (err) {
      results.push({ username, status: 'error', error: err.message });
    }
  }

  res.json({ inserted: results });
});

// DELETE /api/test - clear all users (for testing)
router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
