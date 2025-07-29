const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./db');

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

// Enhanced auto-simulation
async function runAutoSimulation() {
  try {
    // Run sensor simulation to update global_sensor_data
    await simulateAllSensors();

    // Log latest global_sensor_data for debugging
    if (process.env.NODE_ENV === 'development') {
      const sensorData = await pool.query(
        `SELECT temperature, humidity, rain_detected, recorded_at 
         FROM global_sensor_data 
         ORDER BY recorded_at DESC 
         LIMIT 1`
      );
      console.log('Global sensor data updated:', sensorData.rows[0]);
    }

    // Fetch only devices with status = 'on' for behavior simulation
    const devices = await pool.query(
      `SELECT device_id, name FROM devices WHERE status = 'on'`
    );

    if (devices.rows.length === 0) {
      console.log('No devices are on, skipping behavior simulation.');
      return;
    }

    // Trigger behavior for each 'on' device
    const deviceIds = devices.rows.map(device => device.device_id);
    console.log(`Running behavior simulation for devices: ${deviceIds.join(', ')}`);
    for (const device of devices.rows) {
      try {
        const response = await fetch(`http://localhost:${PORT}/api/device-behavior/${device.device_id}`, {
          method: 'GET',
        });
        const result = await response.json();
        console.log(`Behavior simulated for device_id ${device.device_id} (${device.name}):`, result);
      } catch (err) {
        console.error(`Error simulating behavior for device_id ${device.device_id}:`, err.message);
      }
    }

    console.log('✅ Auto-simulation completed.');
  } catch (err) {
    console.error('Error in runAutoSimulation:', err.message);
  }
}

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('🛠 Auto-simulation every 60s started...');
  setInterval(runAutoSimulation, 60_000);
  // Initial run after 5s to allow server startup
  setTimeout(runAutoSimulation, 5_000);
});