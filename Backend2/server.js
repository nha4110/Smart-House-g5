// ✅ File: Backend2/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const logoutRoutes = require('./routes/logout'); // ✅ import logout route
const testRoutes = require('./routes/test');     // ✅ test utilities
const deviceRoutes = require('./api/devices');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Default root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// API routes
app.use('/api/devices', deviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logout', logoutRoutes); // ✅ added logout route
app.use('/api/test', testRoutes);     // ✅ test-only tools

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
