import pkg from 'pg';
const { Client } = pkg;

async function test() {
  const client = new Client({
    user: 'postgres',
    password: '12413595@sp',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected directly to postgres!');
    
    // Check if VibeAsk exists
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'vibeask'");
    if (res.rows.length === 0) {
      console.log('Database vibeask does NOT exist. Creating...');
      await client.query('CREATE DATABASE vibeask');
      console.log('Database created.');
    } else {
      console.log('Database vibeask already exists.');
    }
    
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    await client.end();
  }
}

test();
