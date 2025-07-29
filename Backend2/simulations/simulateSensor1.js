const db = require('../db');

// Helper to generate weighted values
function generateWeightedValue(normalMin, normalMax, globalMin, globalMax, bias = 0.8) {
  const roll = Math.random();
  if (roll < bias) {
    // Normal range (80% of time)
    return (Math.random() * (normalMax - normalMin) + normalMin).toFixed(2);
  } else {
    // Extreme range (20% of time)
    const isLow = Math.random() < 0.5;
    if (isLow) {
      return (Math.random() * (normalMin - globalMin) + globalMin).toFixed(2);
    } else {
      return (Math.random() * (globalMax - normalMax) + normalMax).toFixed(2);
    }
  }
}

async function simulateSensor1() {
  const temperature = generateWeightedValue(28, 33, 20, 37);
  const humidity = generateWeightedValue(60, 70, 40, 85);
  const rain_detected = Math.random() < 0.3; // 30% chance of rain

  try {
    await db.query(
      `INSERT INTO global_sensor_data (sensor_type, temperature, humidity, rain_detected)
       VALUES ('climate', $1, $2, $3)`,
      [temperature, humidity, rain_detected]
    );

    console.log(`🌡 Temp: ${temperature}°C | 💧 Humidity: ${humidity}% | ☔ Rain: ${rain_detected}`);
  } catch (error) {
    console.error('❌ simulateSensor1 error:', error.message);
  }
}

module.exports = simulateSensor1;
