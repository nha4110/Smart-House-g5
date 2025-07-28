const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/users');
const logoutRoutes = require('./routes/logout');
const deviceRoutes = require('./api/devices');
const deviceDetailRoute = require('./routes/deviceDetails'); // ✅ NEW
const eventLogRoutes = require('./api/eventlog');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Routes
app.use('/api/devices', deviceRoutes);
app.use('/api/device', deviceDetailRoute); // ✅ NEW
app.use('/api/users', userRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/eventlog', eventLogRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
