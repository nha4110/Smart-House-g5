const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Route imports
const userRoutes = require('./routes/users');
const logoutRoutes = require('./routes/logout');
const deviceRoutes = require('./api/devices');
const deviceDetailRoute = require('./routes/deviceDetails');
const sensorSimRouter = require('./routes/sensorSimRouter'); // Simulate sensor data
const simulateAllSensors = require('./simulations/simulateSensorAll'); // 👈 Import simulation

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/device', deviceDetailRoute);
app.use('/api/sensor', sensorSimRouter); // POST to simulate sensor data

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // 👇 Auto-run simulation every 10s
  console.log('🛠 Auto-simulation every 10s started...');
  setInterval(simulateAllSensors, 10_000);
});
