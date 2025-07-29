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
const sensorSimRouter = require('./routes/sensorSimRouter');
const simulateAllSensors = require('./simulations/simulateSensorAll');
const globalSensorDataRoutes = require('./api/globalSensorData');
const eventLogRoutes = require('./api/eventLogs');
const simulateRouter = require('./api/simulate');
const sensorProcessor = require('./api/sensorProcessor');

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
app.use('/api/sensor', sensorSimRouter);
app.use('/api/global-sensor-data', globalSensorDataRoutes);
app.use('/api/event-logs', eventLogRoutes);
app.use('/api/simulate', simulateRouter);
app.use('/api', sensorProcessor);

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('🛠 Auto-simulation every 60s started...');
  setInterval(simulateAllSensors, 60_000); // Temporarily disabled
});