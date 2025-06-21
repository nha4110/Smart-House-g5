import { Client } from 'pg';

let cachedClient = global.pgClient; // cache client

if (!cachedClient) {
  cachedClient = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: { rejectUnauthorized: false },
  });

  await cachedClient.connect(); // wait time for connection
  global.pgClient = cachedClient;
}

export const db = cachedClient;
