import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// handle GET /
app.get('/', (req, res) => {
  res.send('Welcome! Backend is running.');
});

// Example route to test TB connection
app.post('/api/tb-hook', (req, res) => {
  console.log('Received from ThingsBoard:', req.body);
  res.status(200).json({ message: 'Received data from TB!' });
});

// Test GET route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend running OK!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
