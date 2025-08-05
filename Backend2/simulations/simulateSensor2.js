// simulations/simulateSensor2.js
const db = require('../db');

async function simulateSensor2() {
  const rain_detected = Math.random() < 0.3;

  try {
    await db.query(
      `INSERT INTO global_sensor_data (sensor_type, rain_detected)
       VALUES ('climate', $1)`, // Keep the type 'climate'
      [rain_detected]
    );

    console.log(`🌧 Simulated Rain: Detected = ${rain_detected}`);
  } catch (error) {
    console.error('❌ simulateSensor2 error:', error);
    throw error;
  }
}

module.exports = simulateSensor2;
