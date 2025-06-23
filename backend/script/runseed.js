import { db } from '../lib/db.js';
import { readFile } from 'fs/promises';

async function runSeedSQL() {
  try {
    console.log('✅ Using connected Neon client');

    const sql = await readFile('./db/seed.sql', 'utf8'); 
    await db.query(sql);

    console.log('Seed SQL executed successfully');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await db.end(); // optional or reuse for cache
  }
}

runSeedSQL();
