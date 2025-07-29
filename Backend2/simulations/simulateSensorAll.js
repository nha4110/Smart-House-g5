const simulateSensor1 = require('./simulateSensor1');

async function simulateAllSensors() {
  try {
    await simulateSensor1();
    console.log('✅ Sensor simulation completed.\n');
  } catch (err) {
    console.error('❌ Simulation failed:', err.message);
  }
}

// Run every 10 seconds if run standalone
if (require.main === module) {
  console.log('🚀 Starting sensor simulation every 600s...\n');
  setInterval(simulateAllSensors, 60_000);
}

module.exports = simulateAllSensors;
