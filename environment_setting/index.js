// Import the PostgreSQL client from the 'pg' package
const { Client } = require('pg');

// Import axios for making HTTP requests (used for ThingsBoard API)
const axios = require('axios');

const db = new Client({
  host: process.env.PGHOST,           // Neon host URL
  database: process.env.PGDATABASE,   
  user: process.env.PGUSER,          
  password: process.env.PGPASSWORD,  
  port: process.env.PGPORT,           // PostgreSQL port 
  ssl: { rejectUnauthorized: false }, // SSL required for Neon (accept self-signed certs)
});

// Connect to Neon 
db.connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL")) 
  .catch(err => console.error("❌ PostgreSQL connection error:", err)); 

// === ThingsBoard Setup ===

// Load the access token for the temperature sensor from environment variables
const tempSensorToken = process.env.TB_TOKEN_TEMP_SENSOR;

async function sendTempData(temp) {
  //The URL to send telemetry to the correct device via its token
  const url = `${process.env.THINGSBOARD_HOST}/api/v1/${tempSensorToken}/telemetry`;

  const data = { temperature: temp };

  try {
    // Send a POST request to the ThingsBoard telemetry endpoint
    const response = await axios.post(url, data);

    console.log('Telemetry sent:', response.data);
  } catch (error) {
    console.error('❌ Error sending telemetry:', error.message);
  }
}

async function run() {
  try {
    const tempValue = 25; // Example temperature value 

    //Send temperature data to ThingsBoard
    await sendTempData(tempValue);

    //Save the temperature data to the PostgreSQL database
    await db.query(
      'INSERT INTO temperature_logs(temp_celsius) VALUES($1)', 
      [tempValue] // Use parameterized query to prevent SQL injection
    );

    
    console.log('✅ Data inserted into Neon PostgreSQL');
  } catch (err) {
    // Catch and print any errors from either API or DB
    console.error('❌ Error during operation:', err.message);
  } finally {
    db.end();
  }
}

run();
