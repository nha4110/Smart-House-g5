import { db } from '../lib/db.js';
import { writeFile } from 'fs/promises';

try {
  const result = await db.query('SELECT * FROM test_table');
  await writeFile('./exports/test_table.json', JSON.stringify(result.rows, null, 2));
  console.log('Data exported to exports/test_table.json');
} catch (err) {
  console.error('❌ Export failed:', err.message);
} finally {
  await db.end();
}
