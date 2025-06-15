const express = require('express');
const { Client } = require('pg');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// === PostgreSQL Setup ===
const db = new Client({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }, // required by Neon
});

db.connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL connection error:", err));

// === ThingsBoard Setup ===
const tempSensorToken = process.env.TB_TOKEN_TEMP_SENSOR;
const thingsboardUrl = process.env.THINGSBOARD_HOST;

// Function to send telemetry to ThingsBoard
async function sendTempData(temp) {
  const url = `${thingsboardUrl}/api/v1/${tempSensorToken}/telemetry`;
  const data = { temperature: temp };

  try {
    const response = await axios.post(url, data);
    console.log('📡 Telemetry sent to ThingsBoard:', response.status);
  } catch (error) {
    console.error('❌ Failed to send telemetry:', error.message);
  }
}

// fetch and store temp
app.post('/send-temp', async (req, res) => {
  const tempValue = req.body.temp || 25; // fallback to 25°C

  try {
    await sendTempData(tempValue);
    await db.query('INSERT INTO temperature_logs(temp_celsius) VALUES($1)', [tempValue]);

    res.status(200).json({ message: '✅ Temp data sent & stored', value: tempValue });
  } catch (err) {
    console.error('❌ Operation error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// vite fe servers
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
