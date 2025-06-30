import { db } from '../lib/db.js';
import { writeFile, mkdir } from 'fs/promises';

const EXPORT_DIR = './exports';

try {
  // Throw no exception if Dir already exist
  await mkdir(EXPORT_DIR, { recursive: true });

  const res = await db.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);// Query every pg_tables
  const tables = res.rows.map(row => row.tablename);
  // querries column and rows
  for (const table of tables) {
    const result = await db.query(`SELECT * FROM ${table}`);
    await writeFile(`${EXPORT_DIR}/${table}.json`, JSON.stringify(result.rows, null, 2), 'utf8');
    console.log(`✅ Exported ${table}`);
  }

  console.log('All done!');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await db.end();
}