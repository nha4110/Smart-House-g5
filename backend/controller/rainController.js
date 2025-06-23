export async function insertRainData(req, res) {
  const {
    is_raining,
    rain_value,
    roof_status,
    door_status,
    tank_status,
    manual_override
  } = req.body;

  try {
    await db.query(
      `INSERT INTO rain_sensors (
        is_raining,
        rain_value,
        roof_status,
        door_status,
        tank_status,
        manual_override
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        is_raining,
        rain_value,
        roof_status,
        door_status,
        tank_status,
        manual_override
      ]
    );

    res.status(201).json({ message: '✅ Rain data inserted' });
  } catch (err) {
    console.error('❌ DB Insert Error:', err.message);
    res.status(500).json({ error: 'Database insert failed' });
  }
}

// getRainLogs: Fetches the 20 most recent entries from the rain_sensors table, ordered by timestamp
export async function getRainLogs(req, res) {
  try {
    const result = await db.query(
      'SELECT * FROM rain_sensors ORDER BY timestamp DESC LIMIT 20'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ DB Fetch Error:', err.message);
    res.status(500).json({ error: 'Database fetch failed' });
  }
}
