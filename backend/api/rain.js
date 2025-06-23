// using POST and GET requests to rainController functions

import { insertRainData, getRainLogs } from '../controllers/rainController.js';

export default async function handler(req, res) {
  if (req.method === 'POST') return insertRainData(req, res); // Handle incoming rain sensor data
  if (req.method === 'GET') return getRainLogs(req, res);     // Retrieve recent rain sensor logs
  res.status(405).json({ error: 'Method Not Allowed' });      // simple error handler
}

