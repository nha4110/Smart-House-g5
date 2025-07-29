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
const simulateAllSensors = require('./simulations/simulateSensorAll'); // Import simulation
const globalSensorDataRoutes = require('./api/globalSensorData');
const eventLogRoutes = require('./api/eventLogs');
const simulateRouter = require('./api/simulate');
const sensorProcessor = require('./api/sensorProcessor'); // Added sensorProcessor router

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
app.use('/api/global-sensor-data', globalSensorDataRoutes);
app.use('/api/event-logs', eventLogRoutes);
app.use('/api/simulate', simulateRouter);
app.use('/api', sensorProcessor); // Mount sensorProcessor for /api/device-behavior

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // Auto-run simulation every 30s
  console.log('🛠 Auto-simulation every 30s started...');
  setInterval(simulateAllSensors, 100_000);
});