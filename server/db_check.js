import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  password: '12413595@sp',
  host: 'localhost',
  port: 5432,
  database: 'vibeask'
});

async function check() {
  try {
    await client.connect();
    
    // Check tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log("Tables in vibeask DB:", res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

check();
