// ✅ File: Backend2/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const testRoutes = require('./routes/test'); // ✅ include test routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Default root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes); // ✅ /api/test POST and DELETE

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
