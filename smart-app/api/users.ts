// File: smart-app/api/users.ts
import { IncomingMessage, ServerResponse } from 'http';
import { Pool } from 'pg';

// Setup DB pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Helper to parse JSON body
const parseBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const { username } = await parseBody(req);

    if (!username) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Username is required' }));
      return;
    }

    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result.rows[0]));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');

    if (err.code === '23505') {
      res.end(JSON.stringify({ error: 'Username already exists' }));
    } else if (err.code === 'P0001') {
      res.end(JSON.stringify({ error: 'Maximum number of users reached' }));
    } else {
      console.error('API error:', err);
      res.end(JSON.stringify({ error: 'Server error' }));
    }
  }
}
