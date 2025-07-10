// ✅ File: Backend2/routes/logout.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE username = $1 RETURNING *',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
