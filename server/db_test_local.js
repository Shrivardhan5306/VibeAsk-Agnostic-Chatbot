import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  password: '12413595@sp',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});

async function test() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully');
    
    // Check if vibeask DB exists, if not create it
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'vibeask'");
    if (res.rowCount === 0) {
      console.log('Creating vibeask database...');
      await client.query('CREATE DATABASE vibeask');
      console.log('vibeask database created');
    } else {
      console.log('vibeask database already exists');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

test();
