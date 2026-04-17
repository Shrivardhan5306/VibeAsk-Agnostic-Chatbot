import { initDb } from './src/db/pg.js';
initDb().then(() => {
  console.log('Test completed.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
